"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Loader2, AlertTriangle } from "lucide-react"

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted && status === "unauthenticated") {
            router.push("/login")
        }
    }, [mounted, status, router])

    // Not mounted yet - show loading with debug
    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#060912] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#0066FF] mx-auto mb-4" />
                    <p className="text-gray-400">Initializing...</p>
                    <p className="text-xs text-gray-600 mt-2">Layout mounting</p>
                </div>
            </div>
        )
    }

    // Loading session
    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#060912] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#0066FF] mx-auto mb-4" />
                    <p className="text-gray-400">Loading your session...</p>
                    <p className="text-xs text-gray-600 mt-2">Status: {status}</p>
                </div>
            </div>
        )
    }

    // Not authenticated - will redirect
    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen bg-[#060912] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-400 mx-auto mb-4" />
                    <p className="text-amber-400">Session expired</p>
                    <p className="text-xs text-gray-600 mt-2">Redirecting to login...</p>
                </div>
            </div>
        )
    }

    // Authenticated - render dashboard
    return (
        <div className="min-h-screen bg-[#060912]">
            <Sidebar />
            <main className="pl-64 min-h-screen">
                {children}
            </main>
        </div>
    )
}
