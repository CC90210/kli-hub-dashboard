"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard,
    Brain,
    FolderOpen,
    BarChart3,
    Settings,
    LogOut,
    Sparkles,
    ChevronDown,
    FileSpreadsheet,
    Users,
    Package,
    DollarSign
} from "lucide-react"

const documentSubItems = [
    { name: "Retailer Data", href: "/documents?tab=retailer", icon: FileSpreadsheet, color: "text-blue-400" },
    { name: "Customer Lists", href: "/documents?tab=customer", icon: Users, color: "text-purple-400" },
    { name: "Supplier Catalogs", href: "/documents?tab=supplier", icon: Package, color: "text-emerald-400" },
    { name: "Financial Docs", href: "/documents?tab=financial", icon: DollarSign, color: "text-amber-400" },
]

export function Sidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [documentsExpanded, setDocumentsExpanded] = useState(true)

    const isActive = (href: string) => {
        if (href.includes("?")) {
            return pathname.startsWith(href.split("?")[0])
        }
        return pathname === href
    }

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gradient-to-b from-[#0A0F1E] to-[#060912] border-r border-white/10">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
                <div className="relative">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0066FF] via-[#00D4FF] to-[#00F5A0] flex items-center justify-center shadow-lg shadow-[#0066FF]/20">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    KLI Hub
                </span>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
                {/* Dashboard */}
                <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" isActive={isActive("/dashboard")} />

                {/* Intelligence */}
                <NavItem href="/intelligence" icon={Brain} label="Intelligence" isActive={isActive("/intelligence")} />

                {/* Documents Dropdown */}
                <div>
                    <button
                        onClick={() => setDocumentsExpanded(!documentsExpanded)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname.startsWith("/documents")
                                ? "bg-[#0066FF]/20 text-white border border-[#0066FF]/30"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <FolderOpen className={`h-5 w-5 ${pathname.startsWith("/documents") ? "text-[#00D4FF]" : ""}`} />
                            Documents
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${documentsExpanded ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                        {documentsExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="ml-4 mt-1 pl-4 border-l border-white/10 space-y-1">
                                    {documentSubItems.map((item) => {
                                        const Icon = item.icon
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                                            >
                                                <Icon className={`h-4 w-4 ${item.color}`} />
                                                {item.name}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Analytics */}
                <NavItem href="/analytics" icon={BarChart3} label="Analytics" isActive={isActive("/analytics")} />

                {/* Settings */}
                <NavItem href="/settings" icon={Settings} label="Settings" isActive={isActive("/settings")} />
            </nav>

            {/* User & Sign Out */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-[#060912]">
                {session?.user && (
                    <div className="mb-3 px-4 py-2 rounded-lg bg-white/5">
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

function NavItem({ href, icon: Icon, label, isActive }: {
    href: string
    icon: any
    label: string
    isActive: boolean
}) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                    ? "bg-[#0066FF]/20 text-white border border-[#0066FF]/30 shadow-lg shadow-[#0066FF]/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
        >
            <Icon className={`h-5 w-5 ${isActive ? "text-[#00D4FF]" : ""}`} />
            {label}
        </Link>
    )
}
