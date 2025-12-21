"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

export default function RootPage() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [message, setMessage] = useState("Initializing...")

    useEffect(() => {
        if (status === "loading") {
            setMessage("Checking authentication...")
            return
        }

        if (status === "authenticated") {
            setMessage("Welcome back! Redirecting to dashboard...")
            setTimeout(() => router.push("/dashboard"), 500)
            return
        }

        if (status === "unauthenticated") {
            setMessage("Please sign in...")
            setTimeout(() => router.push("/login"), 500)
            return
        }
    }, [status, router])

    return (
        <div className="min-h-screen bg-[#060912] flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#0066FF] mx-auto mb-4" />
                <p className="text-white font-medium">{message}</p>
                <p className="text-xs text-gray-500 mt-2">
                    Status: {status} | Session: {session ? "Yes" : "No"}
                </p>
            </div>
        </div>
    )
}
