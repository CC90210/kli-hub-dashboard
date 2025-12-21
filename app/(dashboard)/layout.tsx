import { ReactNode } from "react"
import { Sparkles, LayoutDashboard, FileText, Settings, LogOut } from "lucide-react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen bg-kli-bg-primary text-kli-text-primary">
            {/* Main Sidebar - Simplified for now */}
            <aside className="w-64 border-r border-kli-border flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-2 font-bold text-xl text-kli-text-primary">
                        <div className="h-8 w-8 rounded-lg bg-kli-primary flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        KLI Hub
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <a href="/chat" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-kli-primary/10 text-kli-primary font-medium">
                        <LayoutDashboard className="h-5 w-5" />
                        Intelligence
                    </a>
                    <a href="/documents" className="flex items-center gap-3 px-4 py-3 rounded-xl text-kli-text-secondary hover:bg-kli-bg-tertiary transition-colors">
                        <FileText className="h-5 w-5" />
                        Documents
                    </a>
                    <a href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-kli-text-secondary hover:bg-kli-bg-tertiary transition-colors">
                        <Settings className="h-5 w-5" />
                        Settings
                    </a>
                </nav>

                <div className="p-4 border-t border-kli-border">
                    <button className="flex items-center gap-3 px-4 py-2 w-full text-left text-kli-text-secondary hover:text-kli-accent-rose transition-colors">
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    )
}
