"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, User, Bell, Shield, Webhook, Save, Check } from "lucide-react"

export default function SettingsPage() {
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="p-8 max-w-4xl">
            <div className="mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-white mb-2"
                >
                    Settings
                </motion.h1>
                <p className="text-gray-400">
                    Manage your account and application preferences.
                </p>
            </div>

            <div className="space-y-6">
                {/* Profile Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-[#0D1321] border border-white/10 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-[#0066FF]/20">
                            <User className="h-5 w-5 text-[#00D4FF]" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Profile</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Display Name
                            </label>
                            <input
                                type="text"
                                defaultValue="Demo User"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#0066FF] focus:outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                defaultValue="user@kli.com"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#0066FF] focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Notifications Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl bg-[#0D1321] border border-white/10 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-[#8B5CF6]/20">
                            <Bell className="h-5 w-5 text-[#D946EF]" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Notifications</h2>
                    </div>

                    <div className="space-y-4">
                        <ToggleSetting
                            label="Email notifications"
                            description="Receive email updates about your account"
                            defaultChecked={true}
                        />
                        <ToggleSetting
                            label="Document processing alerts"
                            description="Get notified when documents finish processing"
                            defaultChecked={true}
                        />
                        <ToggleSetting
                            label="Weekly analytics report"
                            description="Receive weekly summary of your usage"
                            defaultChecked={false}
                        />
                    </div>
                </motion.div>

                {/* Webhooks Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl bg-[#0D1321] border border-white/10 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-[#10B981]/20">
                            <Webhook className="h-5 w-5 text-[#34D399]" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Webhook Configuration</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Chat Webhook URL
                            </label>
                            <input
                                type="url"
                                placeholder="https://n8n.example.com/webhook/chat"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-[#0066FF] focus:outline-none transition-colors font-mono text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Document Processing Webhook URL
                            </label>
                            <input
                                type="url"
                                placeholder="https://n8n.example.com/webhook/documents"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-[#0066FF] focus:outline-none transition-colors font-mono text-sm"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Save Button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00D4FF] text-white font-semibold hover:opacity-90 transition-opacity"
                >
                    {saved ? (
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
                </motion.button>
            </div>
        </div>
    )
}

function ToggleSetting({
    label,
    description,
    defaultChecked
}: {
    label: string
    description: string
    defaultChecked: boolean
}) {
    const [checked, setChecked] = useState(defaultChecked)

    return (
        <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
            <div>
                <p className="font-medium text-white">{label}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <button
                onClick={() => setChecked(!checked)}
                className={`relative w-12 h-6 rounded-full transition-colors ${checked ? "bg-[#0066FF]" : "bg-white/20"
                    }`}
            >
                <motion.div
                    animate={{ x: checked ? 24 : 2 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
                />
            </button>
        </div>
    )
}
