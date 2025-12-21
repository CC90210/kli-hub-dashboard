"use client"

import { FileUploader } from "@/components/documents/FileUploader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DocumentsPage() {
    return (
        <div className="container mx-auto p-8 max-w-7xl animate-in fade-in duration-500">
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Knowledge Base</h1>
                    <p className="text-slate-400">Manage and upload documents for the RAG intelligence system.</p>
                </div>

                <Tabs defaultValue="retailers" className="space-y-6">
                    <TabsList className="bg-slate-900 border border-slate-800">
                        <TabsTrigger value="retailers" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                            Retailer Data
                        </TabsTrigger>
                        <TabsTrigger value="customers" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                            Customer Lists
                        </TabsTrigger>
                        <TabsTrigger value="suppliers" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                            Supplier Catalogs
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="retailers">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white">Upload Retailer Documents</CardTitle>
                                <CardDescription>
                                    Upload price lists, inventory reports, and margin agreements.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FileUploader category="retailer" />
                            </CardContent>
                        </Card>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-white mb-4">Recent Uploads</h3>
                            <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 text-center text-slate-500">
                                No documents uploaded yet.
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="customers">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white">Upload Customer Data</CardTitle>
                                <CardDescription>
                                    Import profiles, purchase history segments, and demographic data.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FileUploader category="customer" />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="suppliers">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white">Upload Supplier Catalogs</CardTitle>
                                <CardDescription>
                                    Import SKU lists, seasonal collections, and cost sheets.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FileUploader category="supplier" />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
