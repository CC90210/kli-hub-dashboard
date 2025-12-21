"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode, Component, ErrorInfo } from "react"

// Error Boundary to catch React errors
class ErrorBoundary extends Component<
    { children: ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: ReactNode }) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("React Error Boundary caught:", error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#060912] flex items-center justify-center p-4">
                    <div className="max-w-md w-full p-6 rounded-2xl bg-red-500/10 border border-red-500/30">
                        <h2 className="text-xl font-bold text-red-400 mb-4">Something went wrong</h2>
                        <p className="text-gray-400 mb-4">The application encountered an error.</p>
                        <div className="p-3 rounded-lg bg-black/30 mb-4">
                            <p className="text-xs text-red-300 font-mono break-all">
                                {this.state.error?.message || "Unknown error"}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null })
                                window.location.reload()
                            }}
                            className="w-full py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ErrorBoundary>
            <SessionProvider
                refetchInterval={5 * 60}
                refetchOnWindowFocus={true}
            >
                {children}
            </SessionProvider>
        </ErrorBoundary>
    )
}
