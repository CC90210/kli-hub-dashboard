"use client"

import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"

interface Message {
    id: string
    content: string
    role: string
    createdAt: string | Date
    sources?: any
}

interface MessageBubbleProps {
    message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === "USER"

    return (
        <div className={cn(
            "flex gap-4 max-w-3xl mx-auto px-4 py-6",
            isUser ? "bg-transparent" : "bg-kli-bg-secondary/50 rounded-2xl"
        )}>
            <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                isUser ? "bg-kli-bg-elevated text-kli-text-secondary" : "bg-gradient-to-br from-kli-primary to-kli-accent-cyan text-white"
            )}>
                {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
            </div>

            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-kli-text-primary">
                        {isUser ? "You" : "KLI Assistant"}
                    </span>
                    <span className="text-xs text-kli-text-muted">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                <div className="prose prose-invert max-w-none text-kli-text-secondary leading-relaxed">
                    {message.content}
                </div>

                {message.sources && (
                    <div className="mt-4 pt-4 border-t border-kli-border font-mono text-xs text-kli-text-muted">
                        {/* Simple rendering of sources for now, can be expanded */}
                        Sources: {JSON.stringify(message.sources)}
                    </div>
                )}
            </div>
        </div>
    )
}
