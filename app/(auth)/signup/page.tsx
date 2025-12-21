"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    Loader2,
    Mail,
    Lock,
    User,
    Sparkles,
    Eye,
    EyeOff,
    ArrowRight,
    Check,
    AlertCircle
} from "lucide-react"

export default function SignUpPage() {
    const router = useRouter()

    // Form state
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    // UI state
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Password validation
    const passwordChecks = [
        { label: "At least 8 characters", valid: password.length >= 8 },
        { label: "Passwords match", valid: password === confirmPassword && confirmPassword.length > 0 }
    ]

    const allChecksValid = passwordChecks.every(check => check.valid)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")

        // Validation
        if (!name.trim()) {
            setError("Please enter your name")
            return
        }

        if (!email.trim()) {
            setError("Please enter your email")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setLoading(true)

        try {
            // Call signup API
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    password
                })
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Failed to create account")
                setLoading(false)
                return
            }

            // Auto-login logic
            const result = await signIn("credentials", {
                email: email.toLowerCase().trim(),
                password,
                redirect: false
            })

            if (result?.error) {
                // If auto-login fails, fallback to login page
                router.push("/login?registered=true")
            } else {
                // Success - go to dashboard
                router.refresh()
                router.push("/dashboard")
            }

        } catch (err) {
            console.error("Signup error:", err)
            setError("Something went wrong. Please try again.")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#060912]">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#8B5CF6]/20 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#D946EF]/15 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0066FF]/10 rounded-full blur-[128px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md z-10"
            >
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", duration: 0.8, delay: 0.1 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#F97316] mb-4 shadow-2xl shadow-[#8B5CF6]/30"
                    >
                        <Sparkles className="h-10 w-10 text-white" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
                    >
                        Create Account
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-400 mt-2"
                    >
                        Join KLI Hub to get started
                    </motion.p>
                </div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#0D1321]/90 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
                >
                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3"
                        >
                            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-red-400 text-sm">{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Smith"
                                    required
                                    disabled={loading}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="employee@company.com"
                                    required
                                    disabled={loading}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Job Title Field (New) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Job Title / Role
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="e.g. Operations Manager"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a strong password"
                                    required
                                    disabled={loading}
                                    className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    required
                                    disabled={loading}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="space-y-2 py-2">
                            {passwordChecks.map((check, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className={`h-5 w-5 rounded-full flex items-center justify-center transition-colors ${check.valid
                                        ? "bg-emerald-500"
                                        : "bg-white/10"
                                        }`}>
                                        {check.valid && <Check className="h-3 w-3 text-white" />}
                                    </div>
                                    <span className={`text-sm transition-colors ${check.valid ? "text-emerald-400" : "text-gray-500"
                                        }`}>
                                        {check.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !allChecksValid}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#F97316] text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8B5CF6]/25"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <p className="mt-6 text-center text-gray-400">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-[#D946EF] hover:text-[#F97316] font-medium transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}
