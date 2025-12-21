import { Sidebar } from "@/components/layout/Sidebar"

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#060912]">
            <Sidebar />
            <main className="pl-64">
                <div className="min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    )
}
