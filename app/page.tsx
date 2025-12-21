"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function RootPage() {
    const router = useRouter()
    const { status } = useSession()

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard")
        } else if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    // Show loading while determining auth status
    return (
        <div className="min-h-screen bg-[#060912] flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading KLI Hub...</p>
            </div>
        </div>
    )
}
