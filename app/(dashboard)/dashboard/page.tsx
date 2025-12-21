"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react"

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    // Debug: Show what's happening
    if (!mounted) {
        return (
            <DebugScreen
                title="Mounting..."
                status="loading"
                details={{ mounted: false, status, session: !!session }}
            />
        )
    }

    if (status === "loading") {
        return (
            <DebugScreen
                title="Loading Session..."
                status="loading"
                details={{ mounted: true, status, session: !!session }}
            />
        )
    }

    if (status === "unauthenticated") {
        return (
            <DebugScreen
                title="Not Authenticated"
                status="warning"
                details={{ mounted: true, status, redirecting: true }}
                message="Redirecting to login..."
            />
        )
    }

    if (!session) {
        return (
            <DebugScreen
                title="No Session Data"
                status="error"
                details={{ mounted: true, status, session: null }}
                message="Session exists but no data. Try refreshing."
            />
        )
    }

    // SUCCESS - Render actual dashboard
    return (
        <div className="p-8 min-h-screen bg-[#060912]">
            {/* Debug Banner - Remove in production */}
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm">
                ✅ Dashboard loaded successfully | User: {session.user?.email} | Status: {status}
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
            <p className="text-gray-400 mb-8">Welcome back, {session.user?.name || session.user?.email}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Queries" value="0" subtitle="Start chatting to see stats" />
                <StatCard title="Documents" value="0" subtitle="Upload documents to begin" />
                <StatCard title="Retailers" value="0" subtitle="No data yet" />
                <StatCard title="Status" value="Online" subtitle="System operational" isStatus />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <QuickAction
                    title="Intelligence Chat"
                    description="Ask questions about your data"
                    href="/intelligence"
                />
                <QuickAction
                    title="Upload Documents"
                    description="Add retailer, customer, or supplier data"
                    href="/documents/retailers"
                />
            </div>
        </div>
    )
}

// Debug Screen Component
function DebugScreen({
    title,
    status,
    details,
    message
}: {
    title: string
    status: "loading" | "error" | "warning" | "success"
    details: Record<string, any>
    message?: string
}) {
    const colors = {
        loading: "text-blue-400 border-blue-500/30 bg-blue-500/10",
        error: "text-red-400 border-red-500/30 bg-red-500/10",
        warning: "text-amber-400 border-amber-500/30 bg-amber-500/10",
        success: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
    }

    const icons = {
        loading: <Loader2 className="h-8 w-8 animate-spin" />,
        error: <AlertTriangle className="h-8 w-8" />,
        warning: <AlertTriangle className="h-8 w-8" />,
        success: <CheckCircle2 className="h-8 w-8" />
    }

    return (
        <div className="min-h-screen bg-[#060912] flex items-center justify-center p-4">
            <div className={`max-w-md w-full p-6 rounded-2xl border ${colors[status]}`}>
                <div className="flex items-center gap-4 mb-4">
                    {icons[status]}
                    <h2 className="text-xl font-semibold">{title}</h2>
                </div>
                {message && <p className="mb-4 opacity-80">{message}</p>}
                <div className="p-3 rounded-lg bg-black/30 font-mono text-xs">
                    <p className="text-gray-500 mb-1">Debug Info:</p>
                    <pre className="text-gray-300 overflow-auto">
                        {JSON.stringify(details, null, 2)}
                    </pre>
                </div>
                <p className="mt-4 text-xs text-gray-500">
                    If stuck, try: Hard refresh (Ctrl+Shift+R) or clear cookies
                </p>
            </div>
        </div>
    )
}

function StatCard({ title, value, subtitle, isStatus = false }: any) {
    return (
        <div className="p-6 rounded-2xl bg-[#0D1321] border border-white/10">
            <p className="text-sm text-gray-400 mb-2">{title}</p>
            <p className={`text-3xl font-bold ${isStatus ? "text-emerald-400" : "text-white"}`}>
                {value}
            </p>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
    )
}

function QuickAction({ title, description, href }: any) {
    return (
        <a
            href={href}
            className="block p-6 rounded-2xl bg-[#0D1321] border border-white/10 hover:border-[#0066FF]/50 transition-colors"
        >
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </a>
    )
}
