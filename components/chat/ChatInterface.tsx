"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageBubble } from "./MessageBubble"
import { ChatSidebar } from "./ChatSidebar"
import { VoiceInput } from "./VoiceInput"
import { useChat } from "@/hooks/useChat"
import { useConversations } from "@/hooks/useConversations"

export function ChatInterface() {
    const [input, setInput] = useState("")
    const [isRecording, setIsRecording] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const {
        messages,
        isLoading,
        sendMessage,
        activeConversation,
        setActiveConversation,
        createNewConversation
    } = useChat()

    const { conversations, deleteConversation } = useConversations()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!input.trim() || isLoading) return

        const message = input.trim()
        setInput("")
        await sendMessage(message)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    const handleVoiceInput = (transcript: string) => {
        setInput(transcript)
        setIsRecording(false)
    }

    // Example queries for empty state
    const exampleQueries = [
        "Which retailer has the best price for SKU-2847?",
        "Show me customer matches for $50-75 budget athletic wear",
        "Compare margin trends across Target, Walmart, Amazon Q4",
        "What are payment terms for Northeast retailers?",
        "Which suppliers have Winter 2025 collection in stock?",
        "Average order value for similar product customers?"
    ]

    return (
        <div className="flex h-[calc(100vh-64px)]">
            {/* Conversation Sidebar */}
            <ChatSidebar
                conversations={conversations}
                activeId={activeConversation?.id}
                onSelect={setActiveConversation}
                onDelete={deleteConversation}
                onNewChat={createNewConversation}
            />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-kli-bg-primary">
                {/* Chat Header */}
                <div className="border-b border-kli-border px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-kli-primary to-kli-accent-cyan flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-kli-text-primary">
                                    KLI Intelligence Assistant
                                </h2>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-kli-accent-emerald animate-pulse" />
                                    <span className="text-sm text-kli-text-secondary">
                                        Real-time data • 12 Retailers • 3,450 Customers
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {messages.length === 0 ? (
                        <EmptyState
                            examples={exampleQueries}
                            onSelectExample={(q) => {
                                setInput(q)
                                textareaRef.current?.focus()
                            }}
                        />
                    ) : (
                        <AnimatePresence>
                            {messages.map((message, index) => (
                                <motion.div
                                    key={message.id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <MessageBubble message={message} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}

                    {isLoading && (
                        <div className="flex items-center gap-3 text-kli-text-secondary">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Analyzing your query...</span>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-kli-border p-4">
                    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                        <div className="relative flex items-end gap-2 bg-kli-bg-tertiary rounded-2xl p-2">
                            <Textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about merchants, suppliers, customers, pricing, inventory..."
                                className="flex-1 min-h-[44px] max-h-[200px] bg-transparent border-0 resize-none focus:ring-0 text-kli-text-primary placeholder:text-kli-text-muted"
                                rows={1}
                            />

                            <div className="flex items-center gap-2">
                                {/* Voice Input Button */}
                                <VoiceInput
                                    isRecording={isRecording}
                                    onStart={() => setIsRecording(true)}
                                    onStop={handleVoiceInput}
                                    onCancel={() => setIsRecording(false)}
                                />

                                {/* Send Button */}
                                <Button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="h-10 w-10 rounded-xl bg-gradient-to-r from-kli-primary to-kli-accent-cyan hover:opacity-90 transition-opacity"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Send className="h-5 w-5" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <p className="text-xs text-kli-text-muted text-center mt-2">
                            Press Enter to send • Shift+Enter for new line • Click mic for voice
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

// Empty state component
function EmptyState({
    examples,
    onSelectExample
}: {
    examples: string[]
    onSelectExample: (query: string) => void
}) {
    return (
        <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="text-center mb-8">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-kli-primary to-kli-accent-cyan flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-kli-text-primary mb-2">
                    Welcome to KLI Hub Intelligence
                </h3>
                <p className="text-kli-text-secondary max-w-md">
                    Your AI-powered assistant for merchant, supplier, and customer intelligence.
                    Ask questions about pricing, inventory, matching, and more.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Active Retailers", value: "12" },
                    { label: "Customer Records", value: "3,450" },
                    { label: "SKUs Tracked", value: "15,230" },
                    { label: "Data Accuracy", value: "99.2%" }
                ].map((stat) => (
                    <div key={stat.label} className="text-center p-4 rounded-xl bg-kli-bg-secondary">
                        <div className="text-2xl font-bold text-kli-primary">{stat.value}</div>
                        <div className="text-sm text-kli-text-secondary">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Example Queries */}
            <div className="w-full max-w-3xl">
                <h4 className="text-sm font-medium text-kli-text-secondary mb-3 text-center">
                    Try these example queries:
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    {examples.map((query, index) => (
                        <button
                            key={index}
                            onClick={() => onSelectExample(query)}
                            className="p-4 text-left rounded-xl bg-kli-bg-secondary hover:bg-kli-bg-tertiary border border-kli-border hover:border-kli-primary/50 transition-all text-sm text-kli-text-secondary hover:text-kli-text-primary"
                        >
                            {query}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
