"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Conversation {
    id: string
    title: string
    updatedAt: Date
}

export function useConversations() {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const router = useRouter()

    // In a real app, this would fetch from an API
    // For now we'll mock or just keep local state if not persistent
    // But since we have a database, we should fetch.

    // TODO: Add fetchConversations API call

    const deleteConversation = async (id: string) => {
        // Optimistic update
        setConversations(prev => prev.filter(c => c.id !== id))

        // API call
        /*
        await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
        */
    }

    return {
        conversations,
        deleteConversation
    }
}
