"use client"

import { DocumentUploadPage } from "@/components/documents/DocumentUploadPage"

export default function CustomerListsPage() {
    return (
        <DocumentUploadPage
            category="customer"
            title="Customer Lists"
            description="Upload customer databases, preference data, and purchase history."
            webhookUrl={process.env.NEXT_PUBLIC_CUSTOMER_WEBHOOK_URL}
            acceptedTypes={["CSV", "XLSX", "JSON"]}
            examples={[
                "Customer databases",
                "Purchase history",
                "Preference profiles",
                "Budget segments"
            ]}
            color="purple"
        />
    )
}
