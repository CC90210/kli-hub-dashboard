import { Sidebar } from "@/components/layout/Sidebar"

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-[#060912]">
            <Sidebar />
            <main className="flex-1 overflow-y-auto pl-64">
                <div className="relative min-h-screen z-0">
                    {children}
                </div>
            </main>
        </div>
    )
}
