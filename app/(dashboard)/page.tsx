"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, FileText, Database, TrendingUp, Users, ArrowRight } from "lucide-react"

export default function DashboardPage() {
    return (
        <div className="container mx-auto p-8 max-w-7xl animate-in fade-in duration-500">
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dashboard Overview</h1>
                    <p className="text-slate-400">Welcome back, Demo User.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-200">Total Queries</CardTitle>
                            <Sparkles className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">1,234</div>
                            <p className="text-xs text-slate-500">+20.1% from last month</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-200">Documents Indexed</CardTitle>
                            <FileText className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">543</div>
                            <p className="text-xs text-slate-500">+12 this week</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-200">Active Retailers</CardTitle>
                            <Users className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">12</div>
                            <p className="text-xs text-slate-500">2 pending onboarding</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-200">System Status</CardTitle>
                            <Database className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-500">Operational</div>
                            <p className="text-xs text-slate-500">99.9% uptime</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="bg-slate-900 border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-blue-500" />
                                Start Intelligence Chat
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-400 mb-4">
                                Ask questions about your data using our advanced RAG system.
                            </p>
                            <div className="flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300">
                                Go to Chat <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <FileText className="h-5 w-5 text-emerald-500" />
                                Upload Data
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-400 mb-4">
                                Add new retailer, customer, or supplier documents to the knowledge base.
                            </p>
                            <div className="flex items-center text-emerald-400 text-sm font-medium group-hover:text-emerald-300">
                                Go to Uploads <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
