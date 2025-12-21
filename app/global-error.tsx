"use client"

import { AlertTriangle } from "lucide-react"

export default function GlobalError({
    error,
    reset
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body className="bg-[#060912] text-white">
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Application Error</h1>
                        <p className="text-gray-400 mb-6">
                            The application encountered a critical error. Please refresh the page.
                        </p>
                        <button
                            onClick={reset}
                            className="px-6 py-3 rounded-xl bg-[#0066FF] text-white font-medium"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            </body>
        </html>
    )
}
