"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { User, Bell, Shield, Save, Check, Loader2, Camera } from "lucide-react"

export default function SettingsPage() {
    const { data: session, update: updateSession } = useSession()
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState("")

    // Form state - initialized from session
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [documentAlerts, setDocumentAlerts] = useState(true)
    const [weeklyReport, setWeeklyReport] = useState(false)

    // Load user data from session
    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || "")
            setEmail(session.user.email || "")
        }
    }, [session])

    // Load notification preferences from API
    useEffect(() => {
        async function loadPreferences() {
            try {
                const response = await fetch("/api/user/preferences")
                if (response.ok) {
                    const data = await response.json()
                    setEmailNotifications(data.emailNotifications ?? true)
                    setDocumentAlerts(data.documentAlerts ?? true)
                    setWeeklyReport(data.weeklyReport ?? false)
                }
            } catch (err) {
                console.error("Failed to load preferences:", err)
            }
        }
        loadPreferences()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        setError("")

        try {
            const response = await fetch("/api/user/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    emailNotifications,
                    documentAlerts,
                    weeklyReport
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to save")
            }

            // Update the session with new name
            await updateSession({ name })

            setSaved(true)
            setTimeout(() => setSaved(false), 3000)

        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (!session) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-[#0066FF]" />
            </div>
        )
    }

    return (
        <div className="p-8 max-w-3xl">
            {/* Header */}
            <div className="mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2"
                >
                    Settings
                </motion.h1>
                <p className="text-gray-400">
                    Manage your account and preferences
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                >
                    {error}
                </motion.div>
            )}

            <div className="space-y-6">
                {/* Profile Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-gradient-to-br from-[#0D1321] to-[#0D1321]/50 border border-white/10 p-6 overflow-hidden relative"
                >
                    {/* Decorative gradient */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#0066FF]/10 to-[#00D4FF]/5 rounded-full blur-3xl" />

                    <div className="relative">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#00D4FF]">
                                <User className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">Profile</h2>
                        </div>

                        <div className="flex items-start gap-6 mb-6">
                            {/* Avatar */}
                            <div className="relative group">
                                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#0066FF] via-[#00D4FF] to-[#00F5A0] flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-[#0066FF]/20">
                                    {name?.charAt(0)?.toUpperCase() || email?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Display Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        disabled
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-600 mt-1">Email cannot be changed</p>
                                </div>
                            </div>
                        </div>

                        {/* Role Badge */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">Role:</span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#0066FF]/20 text-[#00D4FF] border border-[#0066FF]/30">
                                {session?.user?.role || "USER"}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Notifications Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl bg-gradient-to-br from-[#0D1321] to-[#0D1321]/50 border border-white/10 p-6 overflow-hidden relative"
                >
                    {/* Decorative gradient */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#8B5CF6]/10 to-[#D946EF]/5 rounded-full blur-3xl" />

                    <div className="relative">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#D946EF]">
                                <Bell className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">Notifications</h2>
                        </div>

                        <div className="space-y-1">
                            <ToggleSetting
                                label="Email notifications"
                                description="Receive email updates about your account activity"
                                checked={emailNotifications}
                                onChange={setEmailNotifications}
                                color="purple"
                            />
                            <ToggleSetting
                                label="Document processing alerts"
                                description="Get notified when your documents finish processing"
                                checked={documentAlerts}
                                onChange={setDocumentAlerts}
                                color="purple"
                            />
                            <ToggleSetting
                                label="Weekly analytics report"
                                description="Receive a weekly summary of your usage and insights"
                                checked={weeklyReport}
                                onChange={setWeeklyReport}
                                color="purple"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Account Security Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl bg-gradient-to-br from-[#0D1321] to-[#0D1321]/50 border border-white/10 p-6 overflow-hidden relative"
                >
                    {/* Decorative gradient */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#10B981]/10 to-[#34D399]/5 rounded-full blur-3xl" />

                    <div className="relative">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#10B981] to-[#34D399]">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">Security</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                <div>
                                    <p className="font-medium text-white">Password</p>
                                    <p className="text-sm text-gray-500">Last changed: Never</p>
                                </div>
                                <button className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors">
                                    Change Password
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                <div>
                                    <p className="font-medium text-white">Active Sessions</p>
                                    <p className="text-sm text-gray-500">1 active session</p>
                                </div>
                                <button className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors">
                                    Manage
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Save Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-4"
                >
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0066FF] via-[#00D4FF] to-[#00F5A0] text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-[#0066FF]/25"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Saving...
                            </>
                        ) : saved ? (
                            <>
                                <Check className="h-5 w-5" />
                                Saved!
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                Save Changes
                            </>
                        )}
                    </button>

                    {saved && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-emerald-400 text-sm"
                        >
                            Your changes have been saved
                        </motion.span>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

function ToggleSetting({
    label,
    description,
    checked,
    onChange,
    color = "blue"
}: {
    label: string
    description: string
    checked: boolean
    onChange: (value: boolean) => void
    color?: "blue" | "purple" | "emerald"
}) {
    const colors = {
        blue: "bg-[#0066FF]",
        purple: "bg-[#8B5CF6]",
        emerald: "bg-[#10B981]"
    }

    return (
        <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
            <div>
                <p className="font-medium text-white">{label}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative w-14 h-7 rounded-full transition-colors ${checked ? colors[color] : "bg-white/20"
                    }`}
            >
                <motion.div
                    animate={{ x: checked ? 28 : 4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg"
                />
            </button>
        </div>
    )
}
