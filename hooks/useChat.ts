"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"

interface Message {
    id: string
    content: string
    role: string
    createdAt: Date
    sources?: any
}

interface Conversation {
    id: string
    title: string
    updatedAt: Date
}

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)

    const sendMessage = async (content: string) => {
        try {
            setIsLoading(true)

            // Optimistic update
            const tempId = Date.now().toString()
            const userMsg: Message = {
                id: tempId,
                content,
                role: "USER",
                createdAt: new Date()
            }
            setMessages(prev => [...prev, userMsg])

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: content,
                    conversationId: activeConversation?.id
                })
            })

            if (!response.ok) throw new Error("Failed to send message")

            const data = await response.json()

            // If new conversation started, set it as active
            if (data.conversationId && (!activeConversation || activeConversation.id !== data.conversationId)) {
                setActiveConversation({
                    id: data.conversationId,
                    title: content.substring(0, 30),
                    updatedAt: new Date()
                })
                // In a real app, we'd refetch the full conversation list here or update global state
            }

            setMessages(prev => [...prev, {
                id: data.message.id,
                content: data.message.content,
                role: "ASSISTANT",
                createdAt: new Date(data.message.createdAt),
                sources: data.message.sources
            }])

        } catch (error) {
            console.error("Chat error:", error)
            // Remove optimistic message or show error
        } finally {
            setIsLoading(false)
        }
    }

    const createNewConversation = useCallback(() => {
        setActiveConversation(null)
        setMessages([])
    }, [])

    return {
        messages,
        isLoading,
        sendMessage,
        activeConversation,
        setActiveConversation,
        createNewConversation
    }
}
