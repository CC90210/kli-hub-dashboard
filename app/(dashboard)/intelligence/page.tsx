"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import {
    Send,
    Mic,
    Sparkles,
    Bot,
    User,
    Loader2,
    Plus,
    MessageSquare,
    Search,
    Clock,
    Zap,
    Database,
    TrendingUp,
    Package,
    Users
} from "lucide-react"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
    sources?: { name: string; relevance: number }[]
}

interface Conversation {
    id: string
    title: string
    preview: string
    updatedAt: Date
    messageCount: number
}

export default function IntelligencePage() {
    const { data: session } = useSession()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [activeConversation, setActiveConversation] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            // TODO: Replace with actual webhook call
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage.content,
                    conversationId: activeConversation
                })
            })

            const data = await response.json()

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response || "I'm processing your request. The RAG system will be connected soon.",
                timestamp: new Date(),
                sources: data.sources
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I apologize, but I encountered an error. Please ensure the webhook is configured and try again.",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const startNewChat = () => {
        setMessages([])
        setActiveConversation(null)
    }

    // Example queries with icons
    const exampleQueries = [
        { icon: TrendingUp, text: "Which retailer has the best price for SKU-2847?", color: "from-blue-500 to-cyan-500" },
        { icon: Users, text: "Show me customer matches for $50-75 budget athletic wear", color: "from-purple-500 to-pink-500" },
        { icon: Database, text: "Compare margin trends across Target, Walmart, Amazon Q4", color: "from-emerald-500 to-teal-500" },
        { icon: Package, text: "Which suppliers have Winter 2025 collection in stock?", color: "from-orange-500 to-amber-500" },
        { icon: Zap, text: "What are payment terms for Northeast retailers?", color: "from-rose-500 to-red-500" },
        { icon: TrendingUp, text: "Average order value for similar product customers?", color: "from-indigo-500 to-violet-500" }
    ]

    return (
        <div className="flex h-[calc(100vh-0px)]">
            {/* Conversation Sidebar */}
            <div className="w-72 bg-[#0A0F1E] border-r border-white/10 flex flex-col">
                {/* New Chat Button */}
                <div className="p-4">
                    <button
                        onClick={startNewChat}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00D4FF] text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-[#0066FF]/20"
                    >
                        <Plus className="h-5 w-5" />
                        New Chat
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 pb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 focus:border-[#0066FF]/50 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto px-2">
                    <p className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recent Chats
                    </p>

                    {conversations.length === 0 ? (
                        <div className="px-3 py-8 text-center">
                            <MessageSquare className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No history yet</p>
                            <p className="text-xs text-gray-600">Start a conversation</p>
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => setActiveConversation(conv.id)}
                                className={`w-full text-left p-3 rounded-lg mb-1 transition-all ${activeConversation === conv.id
                                        ? "bg-[#0066FF]/20 border border-[#0066FF]/30"
                                        : "hover:bg-white/5"
                                    }`}
                            >
                                <p className="text-sm font-medium text-white truncate">{conv.title}</p>
                                <p className="text-xs text-gray-500 truncate mt-1">{conv.preview}</p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                                    <Clock className="h-3 w-3" />
                                    <span>{conv.messageCount} messages</span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-gradient-to-b from-[#060912] to-[#0A0F1E]">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-white/10 bg-[#0A0F1E]/80 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#0066FF] via-[#00D4FF] to-[#00F5A0] flex items-center justify-center shadow-lg shadow-[#0066FF]/30">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-[#0A0F1E]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                                KLI Intelligence Assistant
                            </h1>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Online
                                </span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-400">
                                    Powered by RAG • Real-time data
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto">
                    {messages.length === 0 ? (
                        /* Empty State */
                        <div className="h-full flex flex-col items-center justify-center p-8">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", duration: 0.8 }}
                                className="relative mb-8"
                            >
                                <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-[#0066FF] via-[#00D4FF] to-[#00F5A0] flex items-center justify-center shadow-2xl shadow-[#0066FF]/30">
                                    <Sparkles className="h-12 w-12 text-white" />
                                </div>
                                <div className="absolute -inset-4 bg-gradient-to-r from-[#0066FF] to-[#00F5A0] rounded-3xl blur-2xl opacity-20 -z-10" />
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl font-bold text-center bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent mb-3"
                            >
                                Welcome to KLI Intelligence
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-gray-400 text-center max-w-md mb-8"
                            >
                                Your AI-powered assistant for merchant, supplier, and customer intelligence.
                                Ask questions about pricing, inventory, matching, and more.
                            </motion.p>

                            {/* Stats Grid */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="grid grid-cols-4 gap-4 mb-10"
                            >
                                {[
                                    { label: "Retailers", value: "0", color: "from-blue-500 to-cyan-500" },
                                    { label: "Customers", value: "0", color: "from-purple-500 to-pink-500" },
                                    { label: "Documents", value: "0", color: "from-emerald-500 to-teal-500" },
                                    { label: "Status", value: "Ready", color: "from-amber-500 to-orange-500" }
                                ].map((stat, i) => (
                                    <div key={i} className="text-center p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                            {stat.value}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* Example Queries */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="w-full max-w-3xl"
                            >
                                <p className="text-sm text-gray-500 text-center mb-4">Try these example queries:</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {exampleQueries.map((query, i) => {
                                        const Icon = query.icon
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setInput(query.text)}
                                                className="group flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all text-left"
                                            >
                                                <div className={`p-2 rounded-lg bg-gradient-to-br ${query.color} flex-shrink-0`}>
                                                    <Icon className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                                    {query.text}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        /* Messages */
                        <div className="p-6 space-y-6">
                            <AnimatePresence>
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                                    >
                                        {/* Avatar */}
                                        <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${message.role === "user"
                                                ? "bg-gradient-to-br from-purple-500 to-pink-500"
                                                : "bg-gradient-to-br from-[#0066FF] to-[#00D4FF]"
                                            }`}>
                                            {message.role === "user" ? (
                                                <User className="h-5 w-5 text-white" />
                                            ) : (
                                                <Bot className="h-5 w-5 text-white" />
                                            )}
                                        </div>

                                        {/* Message Content */}
                                        <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
                                            <div className={`inline-block p-4 rounded-2xl ${message.role === "user"
                                                    ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                                                    : "bg-white/5 border border-white/10"
                                                }`}>
                                                <p className="text-white whitespace-pre-wrap">{message.content}</p>

                                                {/* Sources */}
                                                {message.sources && message.sources.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-white/10">
                                                        <p className="text-xs text-gray-500 mb-2">Sources:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {message.sources.map((source, i) => (
                                                                <span key={i} className="px-2 py-1 rounded-md bg-white/10 text-xs text-gray-400">
                                                                    {source.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600 mt-2">
                                                {message.timestamp.toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Loading Indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-4"
                                >
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#00D4FF] flex items-center justify-center">
                                        <Bot className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
                                        <Loader2 className="h-4 w-4 animate-spin text-[#00D4FF]" />
                                        <span className="text-gray-400">Thinking...</span>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 bg-[#0A0F1E]/80 backdrop-blur-sm">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative flex items-end gap-3 p-2 rounded-2xl bg-white/5 border border-white/10 focus-within:border-[#0066FF]/50 transition-colors">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about merchants, suppliers, customers, pricing, inventory..."
                                rows={1}
                                className="flex-1 bg-transparent border-0 resize-none text-white placeholder:text-gray-500 focus:outline-none focus:ring-0 py-3 px-4 max-h-32"
                                style={{ minHeight: "48px" }}
                            />

                            <div className="flex items-center gap-2 pr-2">
                                {/* Voice Button */}
                                <button className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                    <Mic className="h-5 w-5" />
                                </button>

                                {/* Send Button */}
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="p-2.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00D4FF] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg shadow-[#0066FF]/20"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Send className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <p className="text-center text-xs text-gray-600 mt-2">
                            Press Enter to send • Shift+Enter for new line • Click mic for voice
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
