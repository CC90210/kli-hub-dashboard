import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Return defaults if database isn't set up yet
        // This prevents the page from crashing
        return NextResponse.json({
            emailNotifications: true,
            documentAlerts: true,
            weeklyReport: false
        })

    } catch (error) {
        console.error("Preferences error:", error)
        // Return defaults on error instead of crashing
        return NextResponse.json({
            emailNotifications: true,
            documentAlerts: true,
            weeklyReport: false
        })
    }
}
