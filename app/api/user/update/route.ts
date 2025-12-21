import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { name, emailNotifications, documentAlerts, weeklyReport } = body

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: name?.trim() || undefined,
                emailNotifications,
                documentAlerts,
                weeklyReport,
                updatedAt: new Date()
            }
        })

        return NextResponse.json({
            success: true,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email
            }
        })

    } catch (error) {
        console.error("Error updating user:", error)
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
}
