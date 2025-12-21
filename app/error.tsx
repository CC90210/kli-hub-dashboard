"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Error({
    error,
    reset
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Application error:", error)
    }, [error])

    return (
        <div className="min-h-screen bg-[#060912] flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
                <p className="text-gray-400 mb-6">
                    We're having trouble loading this page. Please try again.
                </p>
                <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0066FF] text-white font-medium hover:bg-[#0052CC] transition-colors"
                >
                    <RefreshCw className="w-5 h-5" />
                    Try Again
                </button>
                {error.digest && (
                    <p className="mt-4 text-xs text-gray-600">Error ID: {error.digest}</p>
                )}
            </div>
        </div>
    )
}
