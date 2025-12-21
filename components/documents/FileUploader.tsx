"use client"

import { useCallback, useState } from "react"
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
    FileJson
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
    category: "retailer" | "customer" | "supplier" | "merchant"
    onUploadComplete?: (files: UploadedFile[]) => void
    webhookUrl?: string
}

interface UploadedFile {
    id: string
    name: string
    size: number
    type: string
    status: "uploading" | "processing" | "complete" | "error"
    progress: number
    error?: string
}

const ACCEPTED_FILE_TYPES = {
    "application/pdf": [".pdf"],
    "text/csv": [".csv"],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    "application/json": [".json"],
    "text/plain": [".txt"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
}

export function FileUploader({ category, onUploadComplete, webhookUrl }: FileUploaderProps) {
    const [files, setFiles] = useState<UploadedFile[]>([])
    const [isUploading, setIsUploading] = useState(false)

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        // Create file entries
        const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            status: "uploading" as const,
            progress: 0
        }))

        setFiles(prev => [...prev, ...newFiles])
        setIsUploading(true)

        // Upload each file
        for (let i = 0; i < acceptedFiles.length; i++) {
            const file = acceptedFiles[i]
            const fileEntry = newFiles[i]

            try {
                await uploadFile(file, fileEntry.id, category, webhookUrl)
            } catch (error) {
                setFiles(prev => prev.map(f =>
                    f.id === fileEntry.id
                        ? { ...f, status: "error", error: "Upload failed" }
                        : f
                ))
            }
        }

        setIsUploading(false)

        // onUploadComplete?.(files) // Don't call here as state might not recall perfectly, better to filter completed.
    }, [category, webhookUrl, onUploadComplete])

    const uploadFile = async (
        file: File,
        fileId: string,
        category: string,
        webhookUrl?: string
    ) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("category", category)

        // Simulate upload progress
        const updateProgress = (progress: number) => {
            setFiles(prev => prev.map(f =>
                f.id === fileId ? { ...f, progress } : f
            ))
        }

        updateProgress(50)

        // Upload to your API
        const response = await fetch("/api/documents/upload", {
            method: "POST",
            body: formData
        })

        if (!response.ok) {
            throw new Error("Upload failed")
        }

        // Update to processing state
        setFiles(prev => prev.map(f =>
            f.id === fileId ? { ...f, status: "processing", progress: 100 } : f
        ))

        // Simulate processing time
        await new Promise(r => setTimeout(r, 1000))

        // Mark as complete
        setFiles(prev => prev.map(f =>
            f.id === fileId ? { ...f, status: "complete" } : f
        ))

        // Trigger callback if all complete? 
        // Logic for single file completion
    }

    const removeFile = (fileId: string) => {
        setFiles(prev => prev.filter(f => f.id !== fileId))
    }

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: ACCEPTED_FILE_TYPES,
        multiple: true,
        noClick: false, // Allow clicking
        noKeyboard: false
    })

    const getFileIcon = (type: string) => {
        if (type.includes("spreadsheet") || type.includes("csv") || type.includes("excel")) {
            return <FileSpreadsheet className="h-8 w-8 text-kli-accent-emerald" />
        }
        if (type.includes("json")) {
            return <FileJson className="h-8 w-8 text-kli-accent-amber" />
        }
        return <FileText className="h-8 w-8 text-kli-primary" />
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                {...getRootProps()}
                className={cn(
                    "relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer",
                    "hover:border-kli-primary/50 hover:bg-kli-bg-tertiary/50",
                    isDragActive
                        ? "border-kli-primary bg-kli-primary/10"
                        : "border-kli-border bg-kli-bg-secondary"
                )}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center text-center">
                    <div className={cn(
                        "h-16 w-16 rounded-2xl flex items-center justify-center mb-4 transition-colors",
                        isDragActive ? "bg-kli-primary/20" : "bg-kli-bg-tertiary"
                    )}>
                        <Upload className={cn(
                            "h-8 w-8 transition-colors",
                            isDragActive ? "text-kli-primary" : "text-kli-text-secondary"
                        )} />
                    </div>

                    <h3 className="text-lg font-semibold text-kli-text-primary mb-1">
                        {isDragActive ? "Drop files here" : "Drag & drop files here"}
                    </h3>
                    <p className="text-sm text-kli-text-secondary mb-4">
                        or click to browse from your computer
                    </p>

                    <Button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            open()
                        }}
                        className="bg-kli-primary hover:bg-kli-primary-dark"
                    >
                        Browse Files
                    </Button>

                    <p className="text-xs text-kli-text-muted mt-4">
                        Supports: PDF, CSV, XLSX, JSON, TXT, DOCX • No file size limit
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
                        className="space-y-2"
                    >
                        {files.map((file) => (
                            <motion.div
                                key={file.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center gap-4 p-4 rounded-xl bg-kli-bg-secondary border border-kli-border"
                            >
                                {getFileIcon(file.type)}

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-kli-text-primary truncate">
                                            {file.name}
                                        </span>
                                        <span className="text-xs text-kli-text-muted">
                                            {formatFileSize(file.size)}
                                        </span>
                                    </div>

                                    {file.status === "uploading" && (
                                        <div className="mt-2">
                                            <Progress value={file.progress} className="h-1" />
                                        </div>
                                    )}

                                    {file.status === "processing" && (
                                        <div className="flex items-center gap-2 mt-1 text-kli-accent-amber">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span className="text-xs">Processing & indexing...</span>
                                        </div>
                                    )}

                                    {file.status === "complete" && (
                                        <div className="flex items-center gap-2 mt-1 text-kli-accent-emerald">
                                            <CheckCircle2 className="h-4 w-4" />
                                            <span className="text-xs">Indexed successfully</span>
                                        </div>
                                    )}

                                    {file.status === "error" && (
                                        <div className="flex items-center gap-2 mt-1 text-kli-accent-rose">
                                            <AlertCircle className="h-4 w-4" />
                                            <span className="text-xs">{file.error || "Upload failed"}</span>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFile(file.id)}
                                    className="h-8 w-8 text-kli-text-secondary hover:text-kli-accent-rose"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
