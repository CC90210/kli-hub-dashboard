"use client"

import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Clock, MessageSquare, FileText, Users } from "lucide-react"

export default function AnalyticsPage() {
    // Empty state - will be populated with real data
    const hasData = false

    return (
        <div className="p-8">
            <div className="mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-white mb-2"
                >
                    Analytics
                </motion.h1>
                <p className="text-gray-400">
                    Track usage patterns, query performance, and system metrics.
                </p>
            </div>

            {!hasData ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 rounded-2xl bg-[#0D1321] border border-white/10"
                >
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#D946EF]/20 flex items-center justify-center mb-6">
                        <BarChart3 className="h-10 w-10 text-[#D946EF]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Analytics Yet</h3>
                    <p className="text-gray-400 text-center max-w-md">
                        Analytics will appear here once you start using the Intelligence chat and uploading documents.
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Charts and metrics will go here */}
                </div>
            )}
        </div>
    )
}
