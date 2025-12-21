"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"

export default function DashboardError({
    error,
    reset
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Dashboard error:", error)
    }, [error])

    return (
        <div className="h-full w-full flex items-center justify-center min-h-[500px] text-white">
            <div className="text-center max-w-md p-6 bg-[#0D1321] border border-red-500/30 rounded-2xl">
                <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Dashboard Error</h2>
                <p className="text-gray-400 mb-4">{error.message || "Failed to load dashboard components."}</p>
                <button
                    onClick={reset}
                    className="px-4 py-2 bg-[#0066FF] rounded-lg hover:bg-[#0052CC] transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    )
}
