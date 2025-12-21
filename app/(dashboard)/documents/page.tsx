"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    FileSpreadsheet,
    Users,
    Package,
    DollarSign,
    Upload,
    File,
    Check,
    AlertCircle,
    Loader2,
    Trash2,
} from "lucide-react"

interface DocumentCategory {
    id: string
    name: string
    description: string
    icon: any
    color: string
    gradient: string
    webhookEnvKey: string
    acceptedTypes: string[]
    documents: UploadedDocument[]
}

interface UploadedDocument {
    id: string
    name: string
    size: number
    type: string
    status: "uploading" | "processing" | "indexed" | "error"
    uploadedAt: Date
    progress?: number
}

export default function DocumentsPage() {
    const [activeCategory, setActiveCategory] = useState("retailer")
    const [uploadingFiles, setUploadingFiles] = useState<Record<string, UploadedDocument[]>>({})

    const categories: DocumentCategory[] = [
        {
            id: "retailer",
            name: "Retailer Data",
            description: "Price lists, inventory reports, margin agreements",
            icon: FileSpreadsheet,
            color: "text-blue-400",
            gradient: "from-blue-500 to-cyan-500",
            webhookEnvKey: "RETAILER_WEBHOOK_URL",
            acceptedTypes: ["PDF", "CSV", "XLSX", "JSON"],
            documents: []
        },
        {
            id: "customer",
            name: "Customer Lists",
            description: "Customer databases, preferences, purchase history",
            icon: Users,
            color: "text-purple-400",
            gradient: "from-purple-500 to-pink-500",
            webhookEnvKey: "CUSTOMER_WEBHOOK_URL",
            acceptedTypes: ["CSV", "XLSX", "JSON"],
            documents: []
        },
        {
            id: "supplier",
            name: "Supplier Catalogs",
            description: "Product catalogs, wholesale pricing, availability",
            icon: Package,
            color: "text-emerald-400",
            gradient: "from-emerald-500 to-teal-500",
            webhookEnvKey: "SUPPLIER_WEBHOOK_URL",
            acceptedTypes: ["PDF", "CSV", "XLSX", "JSON"],
            documents: []
        },
        {
            id: "financial",
            name: "Financial Documents",
            description: "Invoices, payment terms, transaction records",
            icon: DollarSign,
            color: "text-amber-400",
            gradient: "from-amber-500 to-orange-500",
            webhookEnvKey: "FINANCIAL_WEBHOOK_URL",
            acceptedTypes: ["PDF", "CSV", "XLSX"],
            documents: []
        }
    ]

    const activeData = categories.find(c => c.id === activeCategory)!

    const handleFileDrop = async (files: FileList, categoryId: string) => {
        const category = categories.find(c => c.id === categoryId)
        if (!category) return

        const newFiles: UploadedDocument[] = Array.from(files).map(file => ({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            status: "uploading",
            uploadedAt: new Date(),
            progress: 0
        }))

        setUploadingFiles(prev => ({
            ...prev,
            [categoryId]: [...(prev[categoryId] || []), ...newFiles]
        }))

        // Upload each file
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const fileEntry = newFiles[i]

            try {
                // Simulate upload progress
                for (let p = 0; p <= 100; p += 20) {
                    await new Promise(r => setTimeout(r, 100))
                    setUploadingFiles(prev => ({
                        ...prev,
                        [categoryId]: prev[categoryId]?.map(f =>
                            f.id === fileEntry.id ? { ...f, progress: p } : f
                        ) || []
                    }))
                }

                // Upload to API
                const formData = new FormData()
                formData.append("file", file)
                formData.append("category", categoryId)

                await fetch("/api/documents/upload", {
                    method: "POST",
                    body: formData
                })

                // Update status
                setUploadingFiles(prev => ({
                    ...prev,
                    [categoryId]: prev[categoryId]?.map(f =>
                        f.id === fileEntry.id ? { ...f, status: "indexed" } : f
                    ) || []
                }))

            } catch (error) {
                setUploadingFiles(prev => ({
                    ...prev,
                    [categoryId]: prev[categoryId]?.map(f =>
                        f.id === fileEntry.id ? { ...f, status: "error" } : f
                    ) || []
                }))
            }
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 B"
        const k = 1024
        const sizes = ["B", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
    }

    return (
        <div className="p-8 min-h-screen bg-gradient-to-b from-[#060912] to-[#0A0F1E]">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                    Knowledge Base
                </h1>
                <p className="text-gray-400">
                    Upload and manage documents for the RAG intelligence system
                </p>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-3 mb-8">
                {categories.map((category) => {
                    const Icon = category.icon
                    const isActive = activeCategory === category.id
                    const docCount = (uploadingFiles[category.id] || []).filter(d => d.status === "indexed").length

                    return (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`group relative flex items-center gap-3 px-5 py-3 rounded-xl transition-all ${isActive
                                    ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg`
                                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                                }`}
                        >
                            <Icon className={`h-5 w-5 ${isActive ? "text-white" : category.color}`} />
                            <span className="font-medium">{category.name}</span>
                            {docCount > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? "bg-white/20" : "bg-white/10"
                                    }`}>
                                    {docCount}
                                </span>
                            )}

                            {/* Active indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-transparent"
                                />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Active Category Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Upload Area */}
                        <div className="lg:col-span-2">
                            <div className="rounded-2xl bg-[#0D1321] border border-white/10 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${activeData.gradient}`}>
                                        <activeData.icon className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">{activeData.name}</h2>
                                        <p className="text-sm text-gray-400">{activeData.description}</p>
                                    </div>
                                </div>

                                {/* Drop Zone */}
                                <div
                                    onClick={() => document.getElementById(`file-input-${activeCategory}`)?.click()}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault()
                                        handleFileDrop(e.dataTransfer.files, activeCategory)
                                    }}
                                    className={`relative border-2 border-dashed rounded-xl p-12 cursor-pointer transition-all hover:border-white/30 hover:bg-white/5 border-white/20`}
                                >
                                    <input
                                        id={`file-input-${activeCategory}`}
                                        type="file"
                                        multiple
                                        onChange={(e) => e.target.files && handleFileDrop(e.target.files, activeCategory)}
                                        className="hidden"
                                        accept={activeData.acceptedTypes.map(t => `.${t.toLowerCase()}`).join(",")}
                                    />

                                    <div className="flex flex-col items-center">
                                        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${activeData.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                                            <Upload className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2">
                                            Drag & drop files here
                                        </h3>
                                        <p className="text-gray-400 mb-4">or click to browse</p>
                                        <button className={`px-6 py-2.5 rounded-xl bg-gradient-to-r ${activeData.gradient} text-white font-medium hover:opacity-90 transition-all`}>
                                            Browse Files
                                        </button>
                                        <p className="text-xs text-gray-500 mt-4">
                                            Supports: {activeData.acceptedTypes.join(", ")} • No file size limit
                                        </p>
                                    </div>
                                </div>

                                {/* Uploaded Files List */}
                                {uploadingFiles[activeCategory]?.length > 0 && (
                                    <div className="mt-6 space-y-3">
                                        <h3 className="text-sm font-medium text-gray-400">
                                            Uploaded Files ({uploadingFiles[activeCategory].length})
                                        </h3>
                                        {uploadingFiles[activeCategory].map((file) => (
                                            <div
                                                key={file.id}
                                                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                                            >
                                                <div className={`p-2 rounded-lg bg-gradient-to-br ${activeData.gradient}/20`}>
                                                    <File className={`h-5 w-5 ${activeData.color}`} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-white truncate">{file.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>

                                                        {file.status === "uploading" && (
                                                            <span className="flex items-center gap-1 text-xs text-blue-400">
                                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                                Uploading {file.progress}%
                                                            </span>
                                                        )}
                                                        {file.status === "processing" && (
                                                            <span className="flex items-center gap-1 text-xs text-amber-400">
                                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                                Processing
                                                            </span>
                                                        )}
                                                        {file.status === "indexed" && (
                                                            <span className="flex items-center gap-1 text-xs text-emerald-400">
                                                                <Check className="h-3 w-3" />
                                                                Indexed
                                                            </span>
                                                        )}
                                                        {file.status === "error" && (
                                                            <span className="flex items-center gap-1 text-xs text-red-400">
                                                                <AlertCircle className="h-3 w-3" />
                                                                Failed
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <button className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            {/* Category Stats */}
                            <div className={`rounded-2xl bg-gradient-to-br ${activeData.gradient}/10 border border-white/10 p-6`}>
                                <h3 className="font-semibold text-white mb-4">{activeData.name} Stats</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-400">Documents Uploaded</p>
                                        <p className="text-2xl font-bold text-white">
                                            {(uploadingFiles[activeCategory] || []).filter(d => d.status === "indexed").length}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Total Size</p>
                                        <p className="text-2xl font-bold text-white">
                                            {formatFileSize(
                                                (uploadingFiles[activeCategory] || [])
                                                    .filter(d => d.status === "indexed")
                                                    .reduce((acc, d) => acc + d.size, 0)
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Status</p>
                                        <p className={`text-lg font-semibold ${activeData.color}`}>Ready</p>
                                    </div>
                                </div>
                            </div>

                            {/* Accepted File Types */}
                            <div className="rounded-2xl bg-[#0D1321] border border-white/10 p-6">
                                <h3 className="font-semibold text-white mb-4">Accepted Formats</h3>
                                <div className="flex flex-wrap gap-2">
                                    {activeData.acceptedTypes.map((type) => (
                                        <span
                                            key={type}
                                            className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${activeData.gradient}/20 text-sm font-medium ${activeData.color}`}
                                        >
                                            .{type.toLowerCase()}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Webhook Info */}
                            <div className="rounded-2xl bg-[#0D1321] border border-white/10 p-6">
                                <h3 className="font-semibold text-white mb-2">Webhook Endpoint</h3>
                                <p className="text-xs text-gray-500 mb-3">
                                    Documents uploaded here will be sent to:
                                </p>
                                <code className="block p-3 rounded-lg bg-black/30 text-xs text-gray-400 font-mono break-all">
                                    {`{${activeData.webhookEnvKey}}`}
                                </code>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
