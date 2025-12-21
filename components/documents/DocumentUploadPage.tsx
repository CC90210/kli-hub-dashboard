"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import {
    Upload,
    FileText,
    X,
    CheckCircle2,
    AlertCircle,
    Loader2,
    FileSpreadsheet,
    File,
    Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DocumentUploadPageProps {
    category: "retailer" | "customer" | "supplier"
    title: string
    description: string
    webhookUrl?: string
    acceptedTypes: string[]
    examples: string[]
    color: "blue" | "purple" | "emerald"
}

interface UploadedFile {
    id: string
    name: string
    size: number
    status: "uploading" | "processing" | "complete" | "error"
    progress: number
    error?: string
}

const colorMap = {
    blue: {
        gradient: "from-[#0066FF] to-[#00D4FF]",
        bg: "bg-[#0066FF]/10",
        border: "border-[#0066FF]/30",
        text: "text-[#00D4FF]"
    },
    purple: {
        gradient: "from-[#8B5CF6] to-[#D946EF]",
        bg: "bg-[#8B5CF6]/10",
        border: "border-[#8B5CF6]/30",
        text: "text-[#D946EF]"
    },
    emerald: {
        gradient: "from-[#10B981] to-[#34D399]",
        bg: "bg-[#10B981]/10",
        border: "border-[#10B981]/30",
        text: "text-[#34D399]"
    }
}

export function DocumentUploadPage({
    category,
    title,
    description,
    webhookUrl,
    acceptedTypes,
    examples,
    color
}: DocumentUploadPageProps) {
    const [files, setFiles] = useState<UploadedFile[]>([])
    const colors = colorMap[color]

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            size: file.size,
            status: "uploading" as const,
            progress: 0
        }))

        setFiles(prev => [...prev, ...newFiles])

        for (let i = 0; i < acceptedFiles.length; i++) {
            const file = acceptedFiles[i]
            const fileEntry = newFiles[i]

            try {
                // Simulate progress
                for (let p = 0; p <= 100; p += 20) {
                    await new Promise(r => setTimeout(r, 100))
                    setFiles(prev => prev.map(f =>
                        f.id === fileEntry.id ? { ...f, progress: p } : f
                    ))
                }

                // Upload to API
                const formData = new FormData()
                formData.append("file", file)
                formData.append("category", category)

                const response = await fetch("/api/documents/upload", {
                    method: "POST",
                    body: formData
                })

                if (!response.ok) throw new Error("Upload failed")

                // Update status
                setFiles(prev => prev.map(f =>
                    f.id === fileEntry.id ? { ...f, status: "processing" } : f
                ))

                // Send to webhook if configured
                if (webhookUrl) {
                    const webhookFormData = new FormData()
                    webhookFormData.append("file", file)
                    webhookFormData.append("category", category)
                    // Just fire and forget for webhook to avoid blocking UI if n8n is slow
                    fetch(webhookUrl, { method: "POST", body: webhookFormData }).catch(e => console.error("Webhook error", e));
                }

                // Mark complete
                setFiles(prev => prev.map(f =>
                    f.id === fileEntry.id ? { ...f, status: "complete" } : f
                ))

            } catch (error) {
                setFiles(prev => prev.map(f =>
                    f.id === fileEntry.id ? { ...f, status: "error", error: "Upload failed" } : f
                ))
            }
        }
    }, [category, webhookUrl])

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        noClick: false,
        noKeyboard: false
    })

    const removeFile = (fileId: string) => {
        setFiles(prev => prev.filter(f => f.id !== fileId))
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-2"
                >
                    <div className={cn("p-2 rounded-xl bg-gradient-to-br", colors.gradient)}>
                        <FileText className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">{title}</h1>
                </motion.div>
                <p className="text-gray-400">{description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Area */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl bg-[#0D1321] border border-white/10 p-6"
                    >
                        {/* Dropzone */}
                        <div
                            {...getRootProps()}
                            className={cn(
                                "relative border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer",
                                isDragActive
                                    ? cn("border-[#0066FF] bg-[#0066FF]/5", colors.border, colors.bg)
                                    : "border-white/20 hover:border-white/30 hover:bg-white/5"
                            )}
                        >
                            <input {...getInputProps()} />

                            <div className="flex flex-col items-center text-center">
                                <motion.div
                                    animate={{ y: isDragActive ? -10 : 0 }}
                                    className={cn(
                                        "h-20 w-20 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br",
                                        colors.gradient
                                    )}
                                >
                                    <Upload className="h-10 w-10 text-white" />
                                </motion.div>

                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {isDragActive ? "Drop files here" : "Drag & drop files"}
                                </h3>
                                <p className="text-gray-400 mb-6">
                                    or click anywhere to browse from your computer
                                </p>

                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); open() }}
                                    className={cn(
                                        "px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r transition-all hover:opacity-90",
                                        colors.gradient
                                    )}
                                >
                                    Browse Files
                                </button>

                                <p className="text-sm text-gray-500 mt-6">
                                    Supports: {acceptedTypes.join(", ")} • No file size limit
                                </p>
                            </div>
                        </div>

                        {/* File List */}
                        <AnimatePresence>
                            {files.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-6 space-y-3"
                                >
                                    <h4 className="text-sm font-medium text-gray-400 mb-3">
                                        Uploaded Files ({files.length})
                                    </h4>
                                    {files.map((file) => (
                                        <motion.div
                                            key={file.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                                        >
                                            <div className={cn("p-2 rounded-lg", colors.bg)}>
                                                <FileSpreadsheet className={cn("h-5 w-5", colors.text)} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-white truncate">
                                                        {file.name}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {formatFileSize(file.size)}
                                                    </span>
                                                </div>

                                                {file.status === "uploading" && (
                                                    <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className={cn("h-full bg-gradient-to-r", colors.gradient)}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${file.progress}%` }}
                                                        />
                                                    </div>
                                                )}

                                                {file.status === "processing" && (
                                                    <div className="flex items-center gap-2 mt-1 text-amber-400">
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                        <span className="text-xs">Processing & indexing...</span>
                                                    </div>
                                                )}

                                                {file.status === "complete" && (
                                                    <div className="flex items-center gap-2 mt-1 text-emerald-400">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        <span className="text-xs">Indexed successfully</span>
                                                    </div>
                                                )}

                                                {file.status === "error" && (
                                                    <div className="flex items-center gap-2 mt-1 text-red-400">
                                                        <AlertCircle className="h-3 w-3" />
                                                        <span className="text-xs">{file.error}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => removeFile(file.id)}
                                                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* What to Upload */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-2xl bg-[#0D1321] border border-white/10 p-6"
                    >
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <Sparkles className={cn("h-4 w-4", colors.text)} />
                            What to Upload
                        </h3>
                        <ul className="space-y-3">
                            {examples.map((example, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-400">
                                    <div className={cn("h-1.5 w-1.5 rounded-full bg-gradient-to-r", colors.gradient)} />
                                    {example}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className={cn("rounded-2xl border p-6", colors.bg, colors.border)}
                    >
                        <h3 className="font-semibold text-white mb-4">
                            {title} Stats
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-400">Documents Uploaded</p>
                                <p className="text-2xl font-bold text-white">0</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Total Records</p>
                                <p className="text-2xl font-bold text-white">0</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Last Updated</p>
                                <p className="text-sm text-gray-300">Never</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
