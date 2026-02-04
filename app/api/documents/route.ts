import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        // Use demo user if no session for development
        const userId = session?.user?.id || "demo-user-1"

        const { searchParams } = new URL(req.url)
        const category = searchParams.get("category")

        // Try to fetch documents from database
        try {
            const documents = await prisma.document.findMany({
                where: {
                    ...(category ? { category } : {}),
                    // In a multi-tenant app we'd filter by userId, but for KLI Hub 
                    // we show all shared knowledge base documents
                },
                orderBy: {
                    createdAt: "desc"
                }
            })

            return NextResponse.json(documents)
        } catch (dbError) {
            console.warn("Database error in documents list, returning demo data:", dbError)

            // Return demo data if database fails
            const demoDocs = [
                {
                    id: "demo-doc-1",
                    name: "Retailer_Price_List_2024.pdf",
                    category: "retailer",
                    size: 2450000,
                    status: "INDEXED",
                    createdAt: new Date().toISOString()
                },
                {
                    id: "demo-doc-2",
                    name: "Customer_Segments_Q3.xlsx",
                    category: "customer",
                    size: 890000,
                    status: "INDEXED",
                    createdAt: new Date().toISOString()
                },
                {
                    id: "demo-doc-3",
                    name: "Supplier_Quality_Report.pdf",
                    category: "supplier",
                    size: 1100000,
                    status: "INDEXED",
                    createdAt: new Date().toISOString()
                }
            ]

            const filtered = category ? demoDocs.filter(d => d.category === category) : demoDocs
            return NextResponse.json(filtered)
        }

    } catch (error) {
        console.error("Documents API error:", error)
        return NextResponse.json(
            { error: "Failed to fetch documents" },
            { status: 500 }
        )
    }
}
