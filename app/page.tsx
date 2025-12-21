import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function RootPage() {
    try {
        const session = await getServerSession(authOptions)

        if (session) {
            // User is logged in, go to dashboard
            redirect("/dashboard")
        }
    } catch (error) {
        console.error("Root page auth check failed:", error)
    }

    // User is not logged in or error occurred, go to login
    redirect("/login")
}
