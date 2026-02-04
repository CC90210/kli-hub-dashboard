"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from "recharts"
import {
    BarChart3, TrendingUp, Clock, MessageSquare,
    FileText, Users, Calendar, ArrowUpRight, ArrowDownRight,
    Sparkles, Filter, Download
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

// Simulated data for demo mode
const QUERY_DATA = [
    { name: "Mon", queries: 120, responseTime: 850 },
    { name: "Tue", queries: 154, responseTime: 920 },
    { name: "Wed", queries: 189, responseTime: 1100 },
    { name: "Thu", queries: 240, responseTime: 1050 },
    { name: "Fri", queries: 190, responseTime: 980 },
    { name: "Sat", queries: 85, responseTime: 750 },
    { name: "Sun", queries: 65, responseTime: 680 },
]

const CATEGORY_DATA = [
    { name: "Retailer Data", value: 45, color: "#0066FF" },
    { name: "Customer Lists", value: 25, color: "#8B5CF6" },
    { name: "Supplier Catalogs", value: 20, color: "#10B981" },
    { name: "Financial Docs", value: 10, color: "#F59E0B" },
]

const TOP_QUERIES = [
    { query: "What is our average margin for Q4?", count: 48, trend: "up" },
    { query: "List top 5 underperforming suppliers", count: 32, trend: "up" },
    { query: "Customer churn rate by region", count: 28, trend: "down" },
    { query: "Inventory turnover for electronics category", count: 24, trend: "up" },
]

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState("7d")

    return (
        <div className="p-8 min-h-screen bg-gradient-to-b from-[#060912] to-[#0A0F1E]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                        System Analytics
                    </h1>
                    <p className="text-gray-400">
                        Performance metrics and intelligence insights for your RAG system.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                        {["24h", "7d", "30d", "90d"].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeRange === range
                                    ? "bg-[#0066FF] text-white shadow-lg shadow-[#0066FF]/20"
                                    : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                        <Download className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Queries"
                    value="1,248"
                    change="+12.5%"
                    isUp={true}
                    icon={MessageSquare}
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                />
                <StatCard
                    title="Avg. Response"
                    value="940ms"
                    change="-40ms"
                    isUp={true}
                    icon={Clock}
                    color="text-emerald-500"
                    bg="bg-emerald-500/10"
                />
                <StatCard
                    title="Knowledge Base"
                    value="4.2 GB"
                    change="+240 MB"
                    isUp={true}
                    icon={FileText}
                    color="text-purple-500"
                    bg="bg-purple-500/10"
                />
                <StatCard
                    title="Active Users"
                    value="24"
                    change="+2"
                    isUp={true}
                    icon={Users}
                    color="text-amber-500"
                    bg="bg-amber-500/10"
                />
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Query Volume Chart */}
                <Card className="lg:col-span-2 bg-[#0D1321]/80 border-white/10 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-500" />
                            Query Volume & Performance
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Growth of intelligence requests vs response time
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={QUERY_DATA}>
                                <defs>
                                    <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0D1321',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#fff'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="queries"
                                    stroke="#0066FF"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorQueries)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="responseTime"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    fill="transparent"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Knowledge Base Composition */}
                <Card className="bg-[#0D1321]/80 border-white/10 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-500" />
                            Data Sources
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Breakdown of indexed documents
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] flex flex-col items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={CATEGORY_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {CATEGORY_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0D1321',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#fff'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
                            {CATEGORY_DATA.map((entry) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <span className="text-xs text-gray-400 truncate">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Popular Queries */}
                <Card className="bg-[#0D1321]/80 border-white/10 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-amber-500" />
                            Top Queries
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Most frequent intelligence requests
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {TOP_QUERIES.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-gray-500">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm text-gray-200 font-medium group-hover:text-white transition-colors">{item.query}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-bold text-[#0066FF]">{item.count}</span>
                                        {item.trend === "up" ? (
                                            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* System Health */}
                <Card className="bg-[#0D1321]/80 border-white/10 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Filter className="h-5 w-5 text-emerald-500" />
                            RAG System Status
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Real-time pipeline health check
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <HealthItem label="Embedding Pipeline" status="online" />
                            <HealthItem label="Vector Database" status="online" />
                            <HealthItem label="n8n Webhooks" status="online" />
                            <HealthItem label="Prisma DB" status="online" />
                            <HealthItem label="NextAuth Service" status="online" />
                            <HealthItem label="LLM API (GPT-4o)" status="online" />
                        </div>

                        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#0066FF]/20 to-[#00D4FF]/20 border border-[#0066FF]/20">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 rounded-xl bg-[#0066FF] flex items-center justify-center shadow-lg shadow-[#0066FF]/30">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">Platform Optimization Service</h4>
                                    <p className="text-xs text-blue-300">Auto-scaling & response tuning active</p>
                                </div>
                            </div>
                            <div className="w-full bg-black/30 rounded-full h-1.5 mb-2">
                                <div className="bg-[#00D4FF] h-1.5 rounded-full" style={{ width: '92%' }} />
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-500">
                                <span>Optimization Score</span>
                                <span>92%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function StatCard({ title, value, change, isUp, icon: Icon, color, bg }: any) {
    return (
        <Card className="bg-[#0D1321]/80 border-white/10 backdrop-blur-xl overflow-hidden group hover:border-white/20 transition-all">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold ${isUp ? "text-emerald-500" : "text-red-500"}`}>
                        {change}
                        {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-white">{value}</h3>
                </div>
            </CardContent>
        </Card>
    )
}

function HealthItem({ label, status }: { label: string, status: "online" | "offline" | "degraded" }) {
    const statusColors = {
        online: "bg-emerald-500 shadow-emerald-500/50",
        offline: "bg-red-500 shadow-red-500/50",
        degraded: "bg-amber-500 shadow-amber-500/50"
    }

    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-xs text-gray-300 font-medium">{label}</span>
            <div className={`h-2 w-2 rounded-full ${statusColors[status]} shadow-lg animate-pulse`} />
        </div>
    )
}
