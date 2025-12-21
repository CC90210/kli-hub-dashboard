"use client"

import { MessageSquare, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Conversation {
    id: string
    title: string
    updatedAt: Date
}

interface ChatSidebarProps {
    conversations: Conversation[]
    activeId?: string
    onSelect: (conv: Conversation) => void
    onDelete: (id: string) => void
    onNewChat: () => void
}

export function ChatSidebar({
    conversations = [],
    activeId,
    onSelect,
    onDelete,
    onNewChat
}: ChatSidebarProps) {
    return (
        <div className="w-80 border-r border-kli-border bg-kli-bg-secondary flex flex-col h-full hidden md:flex">
            <div className="p-4">
                <Button
                    onClick={onNewChat}
                    className="w-full justify-start gap-2 bg-kli-primary/10 text-kli-primary hover:bg-kli-primary/20 border border-kli-primary/20"
                >
                    <Plus className="h-4 w-4" />
                    New Chat
                </Button>
            </div>

            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full px-4">
                    <div className="space-y-2 pb-4">
                        <h4 className="text-xs font-medium text-kli-text-muted mb-2 px-2">Recent Chats</h4>
                        {conversations.length === 0 ? (
                            <div className="text-sm text-kli-text-muted text-center py-8">No history yet</div>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    className="group relative"
                                >
                                    <button
                                        onClick={() => onSelect(conv)}
                                        className={cn(
                                            "w-full text-left p-3 rounded-xl text-sm transition-all truncate pr-8",
                                            activeId === conv.id
                                                ? "bg-kli-bg-elevated text-kli-text-primary"
                                                : "text-kli-text-secondary hover:bg-kli-bg-tertiary hover:text-kli-text-primary"
                                        )}
                                    >
                                        {conv.title}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onDelete(conv.id)
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-kli-text-muted hover:text-kli-accent-rose transition-opacity"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            <div className="p-4 border-t border-kli-border">
                {/* User profile could go here */}
            </div>
        </div>
    )
}
