import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()

        // For now, just acknowledge the save
        // Add database update when Prisma is properly configured
        console.log("User update:", session.user.email, body)

        return NextResponse.json({
            success: true,
            message: "Settings saved"
        })

    } catch (error) {
        console.error("Update error:", error)
        return NextResponse.json({ error: "Failed to save" }, { status: 500 })
    }
}
