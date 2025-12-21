"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Mail, Lock, AlertCircle, Eye, EyeOff, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"
    const errorParam = searchParams.get("error")

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(errorParam || "")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrorMessage("")

        try {
            const result = await signIn("credentials", {
                email: email.toLowerCase().trim(),
                password,
                redirect: false,
                callbackUrl
            })

            if (result?.error) {
                setErrorMessage(result.error === "CredentialsSignin"
                    ? "Invalid email or password"
                    : result.error
                )
                setIsLoading(false)
                return
            }

            if (result?.ok) {
                router.push(callbackUrl)
                router.refresh()
            }
        } catch (error) {
            console.error("Login exception:", error)
            setErrorMessage("An unexpected error occurred. Please try again.")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0F1E] p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-900/20">
                        <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">KLI Hub Intelligence</h1>
                    <p className="text-slate-400 mt-2">Sign in to access your dashboard</p>
                </div>

                <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl">
                    {errorMessage && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 flex items-center gap-3"
                        >
                            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                            <p className="text-sm text-red-400">{errorMessage}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@kli.com"
                                    required
                                    disabled={isLoading}
                                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-300">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    required
                                    disabled={isLoading}
                                    className="pl-10 pr-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/20"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Demo Credentials</p>
                        <div className="space-y-2 text-xs font-mono">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Admin:</span>
                                <span className="text-blue-400">admin@kli.com</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Pass:</span>
                                <span className="text-slate-300">KLI-Admin-2024!</span>
                            </div>
                            <div className="h-px bg-slate-700/50 my-2" />
                            <div className="flex justify-between">
                                <span className="text-slate-400">Bypass:</span>
                                <span className="text-blue-400">demo@kli.com</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Pass:</span>
                                <span className="text-slate-300">demo123</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
