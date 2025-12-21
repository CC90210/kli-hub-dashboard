import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function AuthLayout({
    children
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    // If user is already logged in, redirect to dashboard
    if (session) {
        redirect("/dashboard")
    }

    return (
        <div className="min-h-screen bg-[#060912]">
            {children}
        </div>
    )
}
