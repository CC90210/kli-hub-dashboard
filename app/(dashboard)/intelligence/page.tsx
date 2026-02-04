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
    Users,
    ChevronRight,
    ExternalLink,
    Paperclip,
    Info
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
}

export default function IntelligencePage() {
    const { data: session } = useSession()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [activeConversation, setActiveConversation] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
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
        const currentInput = input
        setInput("")
        setIsLoading(true)

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: currentInput.trim(),
                    conversationId: activeConversation
                })
            })

            const data = await response.json()

            const assistantMessage: Message = {
                id: data.message?.id || (Date.now() + 1).toString(),
                role: "assistant",
                content: data.message?.content || data.response || "I&apos;m processing your request. The RAG system will be connected soon.",
                timestamp: new Date(),
                sources: data.message?.sources || data.sources
            }

            setMessages(prev => [...prev, assistantMessage])

            if (data.conversationId && !activeConversation) {
                setActiveConversation(data.conversationId)
            }
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

    const exampleQueries = [
        { icon: TrendingUp, text: "Which retailer has the best price for SKU-2847?", color: "from-blue-500 to-cyan-500" },
        { icon: Users, text: "Show me customer matches for $50-75 sports wear", color: "from-purple-500 to-pink-500" },
        { icon: Database, text: "Compare margin trends across Q4 retailers", color: "from-emerald-500 to-teal-500" },
        { icon: Package, text: "Which suppliers have Winter 2025 in stock?", color: "from-orange-500 to-amber-500" },
    ]

    return (
        <div className="flex h-screen bg-[#060912] overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 bg-[#0A0F1E] border-r border-white/10 flex flex-col z-20">
                <div className="p-6">
                    <button
                        onClick={startNewChat}
                        className="w-full group relative flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all active:scale-95 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[20deg]" />
                        <Plus className="h-4 w-4" />
                        New Intelligence Session
                    </button>
                </div>

                {/* Search Conversations */}
                <div className="px-6 mb-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search history..."
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500/50 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Recents */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-hide">
                    <p className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Recent Intelligence</p>
                    {conversations.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                            <Clock className="h-8 w-8 text-gray-700 mx-auto mb-2" />
                            <p className="text-[11px] text-gray-600 font-medium leading-relaxed">Your intelligence history will appear here.</p>
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <button
                                key={conv.id}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left border transition-all ${activeConversation === conv.id
                                    ? "bg-blue-500/10 border-blue-500/30 text-white"
                                    : "bg-transparent border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200"
                                    }`}
                            >
                                <MessageSquare className={`h-4 w-4 flex-shrink-0 ${activeConversation === conv.id ? "text-blue-400" : ""}`} />
                                <div className="truncate">
                                    <p className="text-xs font-bold truncate">{conv.title}</p>
                                    <p className="text-[10px] opacity-50">{new Date(conv.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Status Bar */}
                <div className="p-6 bg-black/20 border-t border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Engine Optimized</span>
                        </div>
                        <Zap className="h-3 w-3 text-amber-500" />
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 group cursor-help">
                        <div className="flex items-center gap-2 mb-1">
                            <Info className="h-3 w-3 text-blue-400" />
                            <span className="text-[9px] font-bold text-blue-400 uppercase">Pro Tip</span>
                        </div>
                        <p className="text-[9px] text-gray-500 leading-relaxed font-medium">Use &quot;@document&quot; to prioritize specific datasets in your RAG query.</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>

                {/* Header */}
                <div className="relative z-10 px-8 py-6 border-b border-white/5 bg-[#060912]/80 backdrop-blur-3xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-2xl shadow-blue-500/20 group-hover:scale-105 transition-transform">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-[#060912] shadow-lg" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white tracking-tight">KLI Intelligence Hub</h2>
                            <div className="flex items-center gap-3 mt-0.5">
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active Engine</span>
                                <span className="text-[10px] text-gray-600">•</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">RAG 4.0 Stable</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                            <Settings className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto z-10 p-8 space-y-8 scroll-smooth">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center max-w-2xl"
                            >
                                <div className="h-24 w-24 rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 flex items-center justify-center mx-auto mb-10 shadow-3xl shadow-blue-500/30 relative">
                                    <Sparkles className="h-12 w-12 text-white" />
                                    <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
                                </div>
                                <h1 className="text-4xl font-black text-white mb-4 tracking-tighter italic">How can I help you today?</h1>
                                <p className="text-gray-400 mb-12 leading-relaxed text-sm">
                                    Analyze merchant performance, cross-reference supplier catalogs,
                                    or uncover customer trends using the KLI RAG intelligence engine.
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    {exampleQueries.map((q, i) => {
                                        const Icon = q.icon
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setInput(q.text)}
                                                className="group flex items-start gap-4 p-5 rounded-3xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 hover:translate-y-[-4px] transition-all text-left"
                                            >
                                                <div className={`h-10 w-10 flex-shrink-0 rounded-2xl bg-gradient-to-br ${q.color} flex items-center justify-center shadow-lg`}>
                                                    <Icon className="h-5 w-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-black text-white mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-widest">{q.text.split(' ').slice(0, 3).join(' ')}...</p>
                                                    <p className="text-[11px] text-gray-500 leading-tight line-clamp-2">{q.text}</p>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-10 pb-20">
                            <AnimatePresence>
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex gap-6 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                                    >
                                        {/* Avatar */}
                                        <div className={`h-12 w-12 flex-shrink-0 rounded-2xl flex items-center justify-center shadow-xl ${message.role === "user"
                                            ? "bg-gradient-to-br from-indigo-600 to-blue-500"
                                            : "bg-[#0D1321] border border-white/10"
                                            }`}>
                                            {message.role === "user" ? <User className="h-6 w-6 text-white" /> : <Bot className="h-6 w-6 text-blue-400" />}
                                        </div>

                                        {/* Content */}
                                        <div className={`flex-1 min-w-0 ${message.role === "user" ? "text-right" : ""}`}>
                                            <div className="flex items-center gap-2 mb-2 px-1">
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                    {message.role === "user" ? "Client Insight" : "Intelligence Output"}
                                                </span>
                                                <span className="text-[10px] text-gray-700 font-bold">{message.timestamp.toLocaleTimeString()}</span>
                                            </div>

                                            <div className={`inline-block p-6 rounded-3xl leading-relaxed text-[15px] text-gray-200 text-left ${message.role === "user"
                                                ? "bg-gradient-to-br from-indigo-600/90 to-blue-500/90 text-white shadow-2xl shadow-blue-900/20 border border-white/10"
                                                : "bg-[#0D1321]/80 backdrop-blur-2xl border border-white/10 shadow-2xl"
                                                }`}>
                                                {message.content}

                                                {message.sources && (
                                                    <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                                                        <div className="flex items-center gap-2">
                                                            <Database className="h-3 w-3 text-blue-400" />
                                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Verified Sources</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {message.sources.map((s, i) => (
                                                                <button key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all group">
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                                                    <span className="text-[10px] font-bold text-gray-400 group-hover:text-white transition-colors">{s.name}</span>
                                                                    <ExternalLink className="h-3 w-3 text-gray-600 group-hover:text-blue-400" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Loading */}
                            {isLoading && (
                                <div className="flex gap-6">
                                    <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-[#0D1321] border border-white/10 flex items-center justify-center shadow-xl">
                                        <Bot className="h-6 w-6 text-blue-400 animate-pulse" />
                                    </div>
                                    <div className="flex items-center gap-4 px-6 py-4 rounded-3xl bg-[#0D1321]/80 backdrop-blur-2xl border border-white/10 shadow-2xl">
                                        <div className="flex gap-1.5">
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-[bounce_1s_infinite_0ms]" />
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-[bounce_1s_infinite_200ms]" />
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-[bounce_1s_infinite_400ms]" />
                                        </div>
                                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Processing Knowledge Base...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="relative z-20 p-8 pt-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative group">
                            {/* Input Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2rem] blur opacity-10 group-focus-within:opacity-25 transition-opacity duration-500" />

                            <div className="relative flex items-end gap-3 p-3 pl-6 rounded-[1.8rem] bg-[#0D1321]/90 backdrop-blur-3xl border border-white/10 focus-within:border-blue-500/50 transition-all shadow-2xl shadow-black/50 overflow-hidden">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Enter your query... (e.g. 'Analyze supplier performance')"
                                    rows={1}
                                    className="flex-1 bg-transparent border-0 resize-none text-[15px] font-bold text-white placeholder:text-gray-600 focus:outline-none focus:ring-0 py-4 max-h-48 scrollbar-hide"
                                    style={{ minHeight: "24px" }}
                                />

                                <div className="flex items-center gap-2 pb-2">
                                    <button className="p-3 rounded-2xl text-gray-500 hover:text-blue-400 hover:bg-white/5 transition-all">
                                        <Paperclip className="h-5 w-5" />
                                    </button>
                                    <button className="p-3 rounded-2xl text-gray-500 hover:text-blue-400 hover:bg-white/5 transition-all">
                                        <Mic className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={handleSend}
                                        disabled={!input.trim() || isLoading}
                                        className={`flex items-center justify-center h-12 w-12 rounded-2xl transition-all shadow-xl ${!input.trim() || isLoading
                                            ? "bg-white/5 text-gray-700"
                                            : "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-blue-500/20 active:scale-95"
                                            }`}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        ) : (
                                            <Send className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-6 mt-4">
                            <div className="flex items-center gap-1.5">
                                <span className="p-1 rounded bg-white/5 text-[9px] font-black text-gray-600 border border-white/5">ENTER</span>
                                <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Execute Query</span>
                            </div>
                            <div className="h-1 w-1 rounded-full bg-gray-800" />
                            <div className="flex items-center gap-1.5">
                                <span className="p-1 rounded bg-white/5 text-[9px] font-black text-gray-600 border border-white/5">SHIFT+ENTER</span>
                                <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">New Segment</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Settings({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={className}>
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}
