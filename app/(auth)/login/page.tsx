"use client"

import { useState, useEffect, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, Mail, Lock, Sparkles, Eye, EyeOff, CheckCircle2 } from "lucide-react"

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    // Check if user just registered
    useEffect(() => {
        if (searchParams.get("registered") === "true") {
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 5000)
        }
    }, [searchParams])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const result = await signIn("credentials", {
                email: email.toLowerCase().trim(),
                password,
                redirect: false
            })

            if (result?.error) {
                setError(result.error === "CredentialsSignin"
                    ? "Invalid email or password"
                    : result.error
                )
                setLoading(false)
                return
            }

            // Success - redirect to dashboard
            window.location.href = "/dashboard"

        } catch (err) {
            setError("Something went wrong. Please try again.")
            setLoading(false)
        }
    }

    return (
        <div className="bg-[#0D1321]/90 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
            {/* Success Message */}
            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3"
                >
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    Account created successfully! Please sign in.
                </motion.div>
            )}

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

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@company.com"
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 transition-all"
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
                            required
                            placeholder="Enter your password"
                            className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 transition-all"
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
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0066FF] via-[#00D4FF] to-[#00F5A0] text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0066FF]/25"
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
                <Link
                    href="/signup"
                    className="text-[#00D4FF] hover:text-[#00F5A0] font-medium transition-colors"
                >
                    Create one
                </Link>
            </p>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#060912] p-4">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-[#0066FF]/20 to-[#00D4FF]/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-[#00F5A0]/15 to-[#00D9FF]/15 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#8B5CF6]/10 to-[#D946EF]/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0066FF] via-[#00D4FF] to-[#00F5A0] mb-4 shadow-2xl shadow-[#0066FF]/30"
                    >
                        <Sparkles className="h-10 w-10 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
                        KLI Hub
                    </h1>
                    <p className="text-gray-400 mt-2">Sign in to your account</p>
                </div>

                {/* Form Card with Suspense */}
                <Suspense
                    fallback={
                        <div className="bg-[#0D1321]/90 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl h-[400px] flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-[#0066FF]" />
                        </div>
                    }
                >
                    <LoginForm />
                </Suspense>
            </motion.div>
        </div>
    )
}
