"use client"

import { DocumentUploadPage } from "@/components/documents/DocumentUploadPage"

export default function SupplierCatalogsPage() {
    return (
        <DocumentUploadPage
            category="supplier"
            title="Supplier Catalogs"
            description="Upload product catalogs, pricing sheets, and availability data from suppliers."
            webhookUrl={process.env.NEXT_PUBLIC_SUPPLIER_WEBHOOK_URL}
            acceptedTypes={["PDF", "CSV", "XLSX", "JSON"]}
            examples={[
                "Product catalogs",
                "Wholesale pricing",
                "MOQ requirements",
                "Lead time data"
            ]}
            color="emerald"
        />
    )
}
