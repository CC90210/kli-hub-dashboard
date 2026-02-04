"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Sparkles, FileText, Database, TrendingUp, Users, ArrowRight,
    Brain, ShieldCheck, Zap, Activity, Globe, Layout, Search, Plus
} from "lucide-react"
import Link from "next/link"

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function DashboardPage() {
    const { data: session } = useSession()
    const firstName = session?.user?.name?.split(' ')[0] || "there"

    return (
        <div className="p-8 min-h-screen bg-gradient-to-b from-[#060912] to-[#0A0F1E] overflow-x-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500 rounded-full blur-[120px]" />
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-10 max-w-7xl mx-auto"
            >
                {/* Hero Header */}
                <motion.div variants={item} className="mb-12">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">System Operational</span>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight text-white mb-3">
                        Welcome back, <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">{firstName}</span>.
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
                        Your enterprise intelligence engine is ready. Access real-time data analysis,
                        document retrieval, and predictive insights across your entire ecosystem.
                    </p>
                </motion.div>

                {/* Quick Stats Banner */}
                <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="flex items-center gap-5 p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl group hover:bg-white/[0.05] transition-all">
                        <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Brain className="h-7 w-7 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Intelligence</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-black text-white">1.2M</h3>
                                <span className="text-[10px] font-bold text-emerald-400">+12%</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl group hover:bg-white/[0.05] transition-all">
                        <div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Zap className="h-7 w-7 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Avg Response</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-black text-white">420ms</h3>
                                <span className="text-[10px] font-bold text-emerald-400">Stable</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl group hover:bg-white/[0.05] transition-all">
                        <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Activity className="h-7 w-7 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Index Health</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-black text-white">99.9%</h3>
                                <span className="text-[10px] font-bold text-emerald-400">Optimal</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Primary Actions */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ActionCard
                            href="/intelligence"
                            title="Start Intelligence Chat"
                            description="Deep query your retailers, customers and suppliers using natural language."
                            icon={Sparkles}
                            color="text-blue-500"
                            bg="bg-blue-500/10"
                            accent="from-blue-600/40 to-cyan-500/40"
                        />
                        <ActionCard
                            href="/documents"
                            title="Expand Knowledge Base"
                            description="Upload new datasets to improve the accuracy of retrieval models."
                            icon={Plus}
                            color="text-emerald-500"
                            bg="bg-emerald-500/10"
                            accent="from-emerald-600/40 to-teal-500/40"
                        />
                        <ActionCard
                            href="/analytics"
                            title="System Analytics"
                            description="Real-time monitoring of platform performance and model accuracy."
                            icon={TrendingUp}
                            color="text-purple-500"
                            bg="bg-purple-500/10"
                            accent="from-purple-600/40 to-pink-500/40"
                        />
                        <ActionCard
                            href="/settings"
                            title="Security & Auth"
                            description="Manage access control, API keys and notification preferences."
                            icon={ShieldCheck}
                            color="text-amber-500"
                            bg="bg-amber-500/10"
                            accent="from-amber-600/40 to-orange-500/40"
                        />
                    </div>

                    {/* Side Panel: Recent Activity */}
                    <motion.div variants={item}>
                        <Card className="h-full bg-white/[0.02] border-white/10 backdrop-blur-2xl rounded-[2rem] overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-xl text-white font-black flex items-center justify-between">
                                    System Feed
                                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                </CardTitle>
                                <CardDescription className="text-gray-500">Latest platform events</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 space-y-6">
                                <FeedItem
                                    icon={FileText}
                                    color="text-blue-400"
                                    label="Document Indexed"
                                    time="2m ago"
                                    content="Retailer_Price_List_Global.pdf"
                                />
                                <FeedItem
                                    icon={Users}
                                    color="text-purple-400"
                                    label="Auth Event"
                                    time="15m ago"
                                    content="New admin session initiated"
                                />
                                <FeedItem
                                    icon={Globe}
                                    color="text-emerald-400"
                                    label="n8n Sync"
                                    time="1h ago"
                                    content="Vector sync completed via webhook"
                                />
                                <FeedItem
                                    icon={Search}
                                    color="text-amber-400"
                                    label="Query Spikes"
                                    time="3h ago"
                                    content="Detected 24% increase in Q4 queries"
                                />

                                <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 text-gray-400 font-bold text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
                                    View Platform Logs
                                </button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

function ActionCard({ href, title, description, icon: Icon, color, bg, accent }: any) {
    return (
        <motion.div variants={item} className="h-full">
            <Link href={href} className="block h-full">
                <div className="relative h-full p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-2xl overflow-hidden group hover:bg-white/[0.04] transition-all">
                    {/* Hover Gradient */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${accent} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />

                    <div className="relative z-10">
                        <div className={`h-14 w-14 rounded-2xl ${bg} ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <Icon className="h-7 w-7" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">{description}</p>

                        <div className={`flex items-center text-sm font-black ${color} group-hover:translate-x-2 transition-transform`}>
                            Analyze <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

function FeedItem({ icon: Icon, color, label, time, content }: any) {
    return (
        <div className="flex gap-4">
            <div className={`h-10 w-10 flex-shrink-0 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
                <div className="flex items-center justify-between gap-4 mb-0.5">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
                    <span className="text-[10px] text-gray-600 font-bold">{time}</span>
                </div>
                <p className="text-sm font-bold text-gray-300 truncate">{content}</p>
            </div>
        </div>
    )
}
