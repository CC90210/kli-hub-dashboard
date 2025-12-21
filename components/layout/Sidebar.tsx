"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
    LayoutDashboard,
    Brain,
    FolderOpen,
    BarChart3,
    Settings,
    LogOut,
    Sparkles
} from "lucide-react"

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Intelligence", href: "/intelligence", icon: Brain },
    { name: "Documents", href: "/documents/retailers", icon: FolderOpen },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[#0A0F1E] border-r border-white/10">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#00D4FF] flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">KLI Hub</span>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? "bg-[#0066FF]/20 text-white border border-[#0066FF]/30"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <Icon className={`h-5 w-5 ${isActive ? "text-[#00D4FF]" : ""}`} />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* User Info & Sign Out */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                {session?.user && (
                    <div className="mb-3 px-4 py-2">
                        <p className="text-sm font-medium text-white truncate">
                            {session.user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {session.user.email}
                        </p>
                    </div>
                )}
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-red-500/10 transition-all"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
