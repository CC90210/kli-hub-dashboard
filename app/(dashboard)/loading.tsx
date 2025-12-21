import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div className="h-full w-full flex items-center justify-center min-h-[500px]">
            <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#0066FF] mx-auto mb-4" />
                <p className="text-gray-400">Loading Dashboard...</p>
            </div>
        </div>
    )
}
