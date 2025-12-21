import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const N8N_WEBHOOK_URL = process.env.N8N_CHAT_WEBHOOK_URL!

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        // For development/demo without working auth cookie, we might simulate user
        const userId = session?.user?.id || "demo-user-id"

        const { message, conversationId } = await req.json()

        if (!message?.trim()) {
            return NextResponse.json({ error: "Message required" }, { status: 400 })
        }

        const startTime = Date.now()

        // Get or create conversation
        let conversation = conversationId
            ? await prisma.conversation.findUnique({ where: { id: conversationId } })
            : null

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    title: message.substring(0, 60) + (message.length > 60 ? "..." : ""),
                    userId: userId // Use real user ID in prod
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

        let ragResult: any = { text: "Simulated response (n8n not connected)", sources: null }

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
                        timestamp: new Date().toISOString()
                    })
                })

                if (n8nResponse.ok) {
                    ragResult = await n8nResponse.json()
                }
            } catch (e) {
                console.warn("n8n webhook failed, falling back to simulation", e)
            }
        }

        const responseTime = Date.now() - startTime

        // Save assistant response
        const assistantMessage = await prisma.message.create({
            data: {
                content: ragResult.response || ragResult.text || "I couldn't process that request.",
                role: "ASSISTANT",
                conversationId: conversation.id,
                sources: ragResult.sources || undefined
            }
        })

        // Log query for analytics
        await prisma.query.create({
            data: {
                query: message,
                response: assistantMessage.content,
                // @ts-ignore - Handle potential type mismatch for now
                sources: ragResult.sources || undefined,
                responseTime,
                userId: userId
            }
        })

        return NextResponse.json({
            message: {
                ...assistantMessage,
                sources: ragResult.sources // Return mapped sources
            },
            conversationId: conversation.id,
            responseTime
        })

    } catch (error) {
        console.error("Chat API error:", error)
        return NextResponse.json(
            { error: "Failed to process message" },
            { status: 500 }
        )
    }
}
