import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function RootPage() {
    const session = await getServerSession(authOptions)

    if (session) {
        // User is logged in, go to dashboard
        redirect("/dashboard")
    } else {
        // User is not logged in, go to login
        redirect("/login")
    }
}
