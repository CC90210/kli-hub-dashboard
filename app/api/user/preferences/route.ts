import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                emailNotifications: true,
                documentAlerts: true,
                weeklyReport: true
            }
        })

        return NextResponse.json(user || {
            emailNotifications: true,
            documentAlerts: true,
            weeklyReport: false
        })

    } catch (error) {
        console.error("Error fetching preferences:", error)
        return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 })
    }
}
