"use client"

import { useState, useEffect, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    Loader2,
    Mail,
    Lock,
    Sparkles,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle
} from "lucide-react"

// Main component with Suspense wrapper
export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#060912]">
                <Loader2 className="h-8 w-8 animate-spin text-[#0066FF]" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}

function LoginForm() {

    const router = useRouter()
    const searchParams = useSearchParams()

    // Form state
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    // UI state
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [showSuccess, setShowSuccess] = useState(false)

    // Check if user just registered
    useEffect(() => {
        if (searchParams.get("registered") === "true") {
            setShowSuccess(true)
        }
    }, [searchParams])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setShowSuccess(false)
        setLoading(true)

        try {
            const result = await signIn("credentials", {
                email: email.toLowerCase().trim(),
                password,
                redirect: false
            })

            if (result?.error) {
                // Show user-friendly error messages
                if (result.error.includes("No account found")) {
                    setError("No account found with this email. Please sign up first.")
                } else if (result.error.includes("Incorrect password")) {
                    setError("Incorrect password. Please try again.")
                } else {
                    setError("Invalid email or password")
                }
                setLoading(false)
                return
            }

            // Success! Redirect to dashboard
            router.push("/dashboard")
            router.refresh()

        } catch (err) {
            console.error("Login error:", err)
            setError("Something went wrong. Please try again.")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#060912]">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#0066FF]/20 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#00D4FF]/15 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00F5A0]/10 rounded-full blur-[128px]" />
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
                        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0066FF] via-[#00D4FF] to-[#00F5A0] mb-4 shadow-2xl shadow-[#0066FF]/30"
                    >
                        <Sparkles className="h-10 w-10 text-white" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-200 to-emerald-200 bg-clip-text text-transparent"
                    >
                        KLI Hub
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-400 mt-2"
                    >
                        Sign in to your account
                    </motion.p>
                </div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#0D1321]/90 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
                >
                    {/* Success Message (after registration) */}
                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3"
                        >
                            <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-emerald-400 font-medium">Account created!</p>
                                <p className="text-emerald-400/80 text-sm">Please sign in with your new credentials.</p>
                            </div>
                        </motion.div>
                    )}

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
                                    placeholder="you@company.com"
                                    required
                                    disabled={loading}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 transition-all disabled:opacity-50"
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
                                    placeholder="Enter your password"
                                    required
                                    disabled={loading}
                                    className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 transition-all disabled:opacity-50"
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0066FF] via-[#00D4FF] to-[#00F5A0] text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0066FF]/25"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="mt-6 text-center text-gray-400">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={() => router.push("/signup")}
                            className="text-[#00D4FF] hover:text-[#00F5A0] font-medium transition-colors hover:underline"
                        >
                            Create New Account
                        </button>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}
