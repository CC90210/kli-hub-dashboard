"use client"

import { DocumentUploadPage } from "@/components/documents/DocumentUploadPage"

export default function RetailerDataPage() {
    return (
        <DocumentUploadPage
            category="retailer"
            title="Retailer Data"
            description="Upload price lists, inventory reports, and margin agreements from your retail partners."
            webhookUrl={process.env.NEXT_PUBLIC_RETAILER_WEBHOOK_URL}
            acceptedTypes={["PDF", "CSV", "XLSX", "JSON"]}
            examples={[
                "Price catalogs",
                "Inventory snapshots",
                "Margin agreements",
                "Store location data"
            ]}
            color="blue"
        />
    )
}
