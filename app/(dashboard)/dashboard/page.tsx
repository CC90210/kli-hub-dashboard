"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
    MessageSquare,
    FileText,
    Users,
    Activity,
    ArrowRight,
    Sparkles,
    Upload
} from "lucide-react"

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ')
}

export default function DashboardPage() {
    // Empty state stats as requested
    const stats = {
        totalQueries: 0,
        documentsIndexed: 0,
        activeRetailers: 0,
        systemStatus: "Operational"
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-white mb-2"
                >
                    Dashboard Overview
                </motion.h1>
                <p className="text-gray-400">
                    Welcome to KLI Hub. Get started by uploading your data.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Queries"
                    value={stats.totalQueries}
                    subtitle={stats.totalQueries === 0 ? "Start chatting to see stats" : "+20.1% from last month"}
                    icon={MessageSquare}
                    color="blue"
                    delay={0}
                />
                <StatCard
                    title="Documents Indexed"
                    value={stats.documentsIndexed}
                    subtitle={stats.documentsIndexed === 0 ? "Upload documents to begin" : "+12 this week"}
                    icon={FileText}
                    color="purple"
                    delay={0.1}
                />
                <StatCard
                    title="Active Retailers"
                    value={stats.activeRetailers}
                    subtitle={stats.activeRetailers === 0 ? "No retailers yet" : "2 pending onboarding"}
                    icon={Users}
                    color="emerald"
                    delay={0.2}
                />
                <StatCard
                    title="System Status"
                    value={stats.systemStatus}
                    subtitle="99.9% uptime"
                    icon={Activity}
                    color="green"
                    isStatus
                    delay={0.3}
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <QuickActionCard
                    title="Start Intelligence Chat"
                    description="Ask questions about your data using our advanced RAG system."
                    href="/intelligence" // Maps to existing /chat but user calls it Intelligence
                    icon={Sparkles}
                    gradient="from-[#0066FF] to-[#00D4FF]"
                />
                <QuickActionCard
                    title="Upload Data"
                    description="Add new retailer, customer, or supplier documents to the knowledge base."
                    href="/documents/retailers"
                    icon={Upload}
                    gradient="from-[#8B5CF6] to-[#D946EF]"
                />
            </div>

            {/* Getting Started Guide (shown when no data) */}
            {stats.documentsIndexed === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl bg-gradient-to-br from-[#0066FF]/10 to-[#00D4FF]/5 border border-[#0066FF]/20 p-8"
                >
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-[#00D4FF]" />
                        Getting Started
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <GettingStartedStep
                            step={1}
                            title="Upload Your Data"
                            description="Start by uploading retailer price lists, customer data, or supplier catalogs."
                        />
                        <GettingStartedStep
                            step={2}
                            title="Let AI Index"
                            description="Our system will automatically process and index your documents."
                        />
                        <GettingStartedStep
                            step={3}
                            title="Ask Questions"
                            description="Use the Intelligence chat to query your data instantly."
                        />
                    </div>
                </motion.div>
            )}
        </div>
    )
}

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    isStatus = false,
    delay
}: {
    title: string
    value: number | string
    subtitle: string
    icon: any
    color: string
    isStatus?: boolean
    delay: number
}) {
    const colorMap: Record<string, string> = {
        blue: "from-[#0066FF] to-[#00D4FF]",
        purple: "from-[#8B5CF6] to-[#D946EF]",
        emerald: "from-[#10B981] to-[#34D399]",
        green: "from-[#00F5A0] to-[#00D9FF]"
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="relative group"
        >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                style={{ background: `linear-gradient(135deg, ${color === 'blue' ? '#0066FF' : color === 'purple' ? '#8B5CF6' : '#10B981'}20, transparent)` }}
            />
            <div className="relative rounded-2xl bg-[#0D1321] border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                    <span className="text-sm font-medium text-gray-400">{title}</span>
                    <div className={cn(
                        "p-2 rounded-lg bg-gradient-to-br",
                        colorMap[color]
                    )}>
                        <Icon className="h-4 w-4 text-white" />
                    </div>
                </div>
                <div className={cn(
                    "text-3xl font-bold mb-1",
                    isStatus
                        ? "bg-gradient-to-r from-[#00F5A0] to-[#00D9FF] bg-clip-text text-transparent"
                        : "text-white"
                )}>
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
        </motion.div>
    )
}

function QuickActionCard({
    title,
    description,
    href,
    icon: Icon,
    gradient
}: {
    title: string
    description: string
    href: string
    icon: any
    gradient: string
}) {
    return (
        <Link href={href}>
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative group rounded-2xl bg-[#0D1321] border border-white/10 p-6 hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden"
            >
                <div className={cn(
                    "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 blur-2xl transition-opacity group-hover:opacity-20",
                    gradient
                )} />

                <div className="relative">
                    <div className={cn(
                        "inline-flex p-3 rounded-xl bg-gradient-to-br mb-4",
                        gradient
                    )}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{description}</p>
                    <div className="flex items-center gap-2 text-[#00D4FF] font-medium text-sm">
                        Get Started
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}

function GettingStartedStep({
    step,
    title,
    description
}: {
    step: number
    title: string
    description: string
}) {
    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#0066FF] to-[#00D4FF] flex items-center justify-center text-white font-bold text-sm">
                {step}
            </div>
            <div>
                <h4 className="font-medium text-white mb-1">{title}</h4>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
        </div>
    )
}
