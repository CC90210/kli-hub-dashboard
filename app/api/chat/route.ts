import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const N8N_WEBHOOK_URL = process.env.N8N_CHAT_WEBHOOK_URL

// Demo user ID for when database is not connected
const DEMO_USER_ID = "demo-user-1"

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        // Get user ID - use session if available, otherwise demo
        const userId = session?.user?.id || DEMO_USER_ID
        const userName = session?.user?.name || "Demo User"

        const { message, conversationId } = await req.json()

        if (!message?.trim()) {
            return NextResponse.json({ error: "Message required" }, { status: 400 })
        }

        const startTime = Date.now()

        // Try database operations only if prisma is available
        let conversation: any = null
        let assistantMessage: any = null

        try {
            // Get or create conversation
            if (conversationId) {
                conversation = await prisma.conversation.findUnique({
                    where: { id: conversationId }
                })
            }

            if (!conversation) {
                conversation = await prisma.conversation.create({
                    data: {
                        title: message.substring(0, 60) + (message.length > 60 ? "..." : ""),
                        userId: userId
                    }
                })
            }

            // Save user message
            await prisma.message.create({
                data: {
                    content: message,
                    role: "USER",
                    conversationId: conversation.id
                }
            })
        } catch (dbError) {
            console.warn("Database operation failed, continuing without persistence:", dbError)
            // Create a mock conversation for non-database mode
            conversation = {
                id: `temp-${Date.now()}`,
                title: message.substring(0, 60)
            }
        }

        // RAG Response handling
        let ragResult: any = {
            response: null,
            sources: null,
            status: "offline"
        }

        if (N8N_WEBHOOK_URL) {
            try {
                // Send to n8n RAG webhook
                const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message,
                        conversationId: conversation.id,
                        userId: userId,
                        userName: userName,
                        timestamp: new Date().toISOString()
                    }),
                    signal: AbortSignal.timeout(30000) // 30 second timeout
                })

                if (n8nResponse.ok) {
                    ragResult = await n8nResponse.json()
                    ragResult.status = "connected"
                } else {
                    console.warn("n8n webhook returned non-OK status:", n8nResponse.status)
                    ragResult.status = "error"
                }
            } catch (e: any) {
                console.warn("n8n webhook failed:", e.message)
                ragResult.status = e.name === "TimeoutError" ? "timeout" : "offline"
            }
        }

        const responseTime = Date.now() - startTime

        // Generate response content
        let responseContent: string

        if (ragResult.response) {
            responseContent = ragResult.response
        } else if (ragResult.text) {
            responseContent = ragResult.text
        } else {
            // Fallback response when n8n is not connected
            responseContent = generateFallbackResponse(message, ragResult.status)
        }

        // Try to save assistant response to database
        try {
            assistantMessage = await prisma.message.create({
                data: {
                    content: responseContent,
                    role: "ASSISTANT",
                    conversationId: conversation.id,
                    sources: ragResult.sources || undefined
                }
            })

            // Log query for analytics
            await prisma.query.create({
                data: {
                    query: message,
                    response: responseContent,
                    responseTime,
                    userId: userId
                }
            })
        } catch (dbError) {
            // Create mock message if database not available
            assistantMessage = {
                id: `msg-${Date.now()}`,
                content: responseContent,
                role: "ASSISTANT",
                createdAt: new Date(),
                sources: ragResult.sources
            }
        }

        return NextResponse.json({
            message: {
                ...assistantMessage,
                sources: ragResult.sources
            },
            conversationId: conversation.id,
            responseTime,
            ragStatus: ragResult.status
        })

    } catch (error: any) {
        console.error("Chat API error:", error)
        return NextResponse.json(
            {
                error: "Failed to process message",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            },
            { status: 500 }
        )
    }
}

// Generate helpful fallback responses when n8n is not connected
function generateFallbackResponse(query: string, status: string): string {
    const statusMessages: Record<string, string> = {
        offline: "🔌 The RAG system is currently offline.",
        timeout: "⏱️ The RAG system timed out.",
        error: "⚠️ There was an error connecting to the RAG system."
    }

    const statusMessage = statusMessages[status] || statusMessages.offline

    return `${statusMessage}

**Your Query:** "${query}"

Once the n8n RAG workflow is connected, I'll be able to:
• Search through your indexed documents
• Find relevant merchant, supplier, and customer data
• Provide accurate answers with source citations

**To connect the RAG system:**
1. Set up your n8n workflow for document retrieval
2. Add the webhook URL to your environment variables as \`N8N_CHAT_WEBHOOK_URL\`
3. The system will automatically start using your RAG pipeline

In the meantime, you can:
• Upload documents via the Documents tab
• Configure your n8n workflows
• Test the interface with sample queries`
}

