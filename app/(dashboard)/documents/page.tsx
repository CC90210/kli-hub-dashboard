"use client"

import { useState, useEffect, useCallback } from "react"
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
    Search,
    RefreshCw,
    Download,
    ExternalLink,
    MoreVertical,
    Calendar,
    HardDrive
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
}

interface UploadedDocument {
    id: string
    name: string
    size: number
    category: string
    status: "PROCESSING" | "INDEXED" | "FAILED"
    createdAt: string
    progress?: number
}

const CATEGORIES: DocumentCategory[] = [
    {
        id: "retailer",
        name: "Retailer Data",
        description: "Price lists, inventory reports, margin agreements",
        icon: FileSpreadsheet,
        color: "text-blue-400",
        gradient: "from-blue-500 to-cyan-500",
        webhookEnvKey: "RETAILER_WEBHOOK_URL",
        acceptedTypes: ["PDF", "CSV", "XLSX", "JSON"]
    },
    {
        id: "customer",
        name: "Customer Lists",
        description: "Customer databases, preferences, purchase history",
        icon: Users,
        color: "text-purple-400",
        gradient: "from-purple-500 to-pink-500",
        webhookEnvKey: "CUSTOMER_WEBHOOK_URL",
        acceptedTypes: ["CSV", "XLSX", "JSON"]
    },
    {
        id: "supplier",
        name: "Supplier Catalogs",
        description: "Product catalogs, wholesale pricing, availability",
        icon: Package,
        color: "text-emerald-400",
        gradient: "from-emerald-500 to-teal-500",
        webhookEnvKey: "SUPPLIER_WEBHOOK_URL",
        acceptedTypes: ["PDF", "CSV", "XLSX", "JSON"]
    },
    {
        id: "financial",
        name: "Financial Documents",
        description: "Invoices, payment terms, transaction records",
        icon: DollarSign,
        color: "text-amber-400",
        gradient: "from-amber-500 to-orange-500",
        webhookEnvKey: "FINANCIAL_WEBHOOK_URL",
        acceptedTypes: ["PDF", "CSV", "XLSX"]
    }
]

export default function DocumentsPage() {
    const [activeCategory, setActiveCategory] = useState("retailer")
    const [documents, setDocuments] = useState<UploadedDocument[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [uploadingFiles, setUploadingFiles] = useState<UploadedDocument[]>([])

    const fetchDocuments = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/documents?category=${activeCategory}`)
            const data = await response.json()
            setDocuments(data)
        } catch (error) {
            console.error("Failed to fetch documents:", error)
        } finally {
            setLoading(false)
        }
    }, [activeCategory])

    useEffect(() => {
        fetchDocuments()
    }, [fetchDocuments])

    const activeData = CATEGORIES.find(c => c.id === activeCategory)!

    const handleFileDrop = async (files: FileList) => {
        const newUploads: UploadedDocument[] = Array.from(files).map(file => ({
            id: `upload-${Date.now()}-${Math.random()}`,
            name: file.name,
            size: file.size,
            category: activeCategory,
            status: "PROCESSING",
            createdAt: new Date().toISOString(),
            progress: 0
        }))

        setUploadingFiles(prev => [...newUploads, ...prev])

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const uploadId = newUploads[i].id

            try {
                const formData = new FormData()
                formData.append("file", file)
                formData.append("category", activeCategory)

                // Simulate progress
                const interval = setInterval(() => {
                    setUploadingFiles(prev => prev.map(f =>
                        f.id === uploadId ? { ...f, progress: Math.min((f.progress || 0) + 10, 90) } : f
                    ))
                }, 100)

                const response = await fetch("/api/documents/upload", {
                    method: "POST",
                    body: formData
                })

                clearInterval(interval)

                if (response.ok) {
                    setUploadingFiles(prev => prev.filter(f => f.id !== uploadId))
                    fetchDocuments()
                } else {
                    setUploadingFiles(prev => prev.map(f =>
                        f.id === uploadId ? { ...f, status: "FAILED" } : f
                    ))
                }
            } catch (error) {
                setUploadingFiles(prev => prev.map(f =>
                    f.id === uploadId ? { ...f, status: "FAILED" } : f
                ))
            }
        }
    }

    const filteredDocuments = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent mb-2">
                        Intelligence Base
                    </h1>
                    <p className="text-gray-400">
                        Manage documentation used by the KLI Hub RAG engine.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 min-w-[280px] transition-all"
                        />
                    </div>
                    <button
                        onClick={fetchDocuments}
                        disabled={loading}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
                    </button>
                    <button
                        onClick={() => document.getElementById(`file-input`)?.click()}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all"
                    >
                        <Upload className="h-4 w-4" />
                        <span>Upload</span>
                    </button>
                    <input
                        id="file-input"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => e.target.files && handleFileDrop(e.target.files)}
                    />
                </div>
            </div>

            {/* Content Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="space-y-2">
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon
                        const isActive = activeCategory === cat.id
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${isActive
                                        ? "bg-[#0066FF]/10 border-[#0066FF]/30 text-white shadow-xl shadow-[#0066FF]/5"
                                        : "bg-transparent border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl ${isActive ? `bg-gradient-to-br ${cat.gradient} text-white` : "bg-white/5"}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-sm">{cat.name}</p>
                                        <p className="text-[10px] opacity-60">
                                            {cat.id === "retailer" ? "Price & Inventory" : cat.id === "customer" ? "Usage & History" : "Product catalogs"}
                                        </p>
                                    </div>
                                </div>
                                {isActive && <div className="h-1.5 w-1.5 rounded-full bg-[#00D4FF] shadow-lg shadow-[#00D4FF]/50" />}
                            </button>
                        )
                    })}

                    {/* Repository Info */}
                    <div className="mt-10 p-6 rounded-2xl bg-[#0D1321] border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <HardDrive className="h-4 w-4 text-blue-400" />
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Storage Usage</h4>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full mb-2 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '42%' }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500 mb-6">
                            <span>4.2 GB used</span>
                            <span>10 GB limit</span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed italic border-l-2 border-blue-500/30 pl-3">
                            "Documents are automatically chunked and embedded using Ada-002 for optimal RAG performance."
                        </p>
                    </div>
                </div>

                {/* Main Document List */}
                <div className="lg:col-span-3">
                    <div className="bg-[#0D1321]/80 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                            <div className="col-span-6">Document Name</div>
                            <div className="col-span-2">Size</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>

                        {/* List Content */}
                        <div className="min-h-[500px]">
                            {/* Uploading Files */}
                            <AnimatePresence>
                                {uploadingFiles.map((file) => (
                                    <motion.div
                                        key={file.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 bg-blue-500/5 items-center"
                                    >
                                        <div className="col-span-6 flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                                <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                                                <div className="w-48 bg-white/5 h-1 rounded-full mt-2 overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-blue-500"
                                                        initial={{ width: "0%" }}
                                                        animate={{ width: `${file.progress || 0}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2 text-xs text-gray-400">{formatFileSize(file.size)}</div>
                                        <div className="col-span-2">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-[10px] font-bold text-blue-400 uppercase">
                                                {file.status}
                                            </span>
                                        </div>
                                        <div className="col-span-2 flex justify-end">
                                            <button className="p-2 text-gray-500 hover:text-red-400">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Existing Documents */}
                            {loading && documents.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[400px]">
                                    <Loader2 className="h-10 w-10 text-[#0066FF] animate-spin mb-4" />
                                    <p className="text-gray-500 text-sm">Indexing knowledge base...</p>
                                </div>
                            ) : filteredDocuments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[400px]">
                                    <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                                        <File className="h-10 w-10 text-gray-700" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No documents found</h3>
                                    <p className="text-gray-500 text-center max-w-sm text-sm">
                                        Upload documents to see them here, or try a different search term.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {filteredDocuments.map((doc) => (
                                        <motion.div
                                            key={doc.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="grid grid-cols-12 gap-4 px-8 py-5 hover:bg-white/[0.02] transition-colors items-center group"
                                        >
                                            <div className="col-span-6 flex items-center gap-4">
                                                <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${activeData.gradient}/20 flex items-center justify-center transition-transform group-hover:scale-110`}>
                                                    <File className={`h-5 w-5 ${activeData.color}`} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-200 group-hover:text-white truncate transition-colors">
                                                        {doc.name}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 flex items-center gap-2 mt-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(doc.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-span-2 text-xs text-gray-400 tabular-nums">
                                                {formatFileSize(doc.size)}
                                            </div>
                                            <div className="col-span-2">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${doc.status === "INDEXED"
                                                        ? "bg-emerald-500/10 text-emerald-400"
                                                        : doc.status === "FAILED"
                                                            ? "bg-red-500/10 text-red-400"
                                                            : "bg-amber-500/10 text-amber-400"
                                                    }`}>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${doc.status === "INDEXED" ? "bg-emerald-500" : "bg-amber-500"
                                                        }`} />
                                                    {doc.status}
                                                </span>
                                            </div>
                                            <div className="col-span-2 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10">
                                                    <Download className="h-4 w-4" />
                                                </button>
                                                <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10">
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pagination / Status Bar */}
                        <div className="bg-white/[0.02] px-8 py-4 border-t border-white/5 flex items-center justify-between">
                            <p className="text-[11px] text-gray-500">
                                Showing <span className="text-gray-300 font-bold">{filteredDocuments.length}</span> documents
                            </p>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] text-gray-500 font-medium">Auto-indexing active</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                    <span className="text-[10px] text-gray-500 font-medium">SSL Encrypted</span>
                                </div>
                                <button className="text-[11px] text-[#0066FF] font-bold hover:underline underline-offset-4">
                                    View Logs
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
