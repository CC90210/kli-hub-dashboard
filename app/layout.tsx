import { Providers } from "./providers"
import "./globals.css"

export const metadata = {
  title: "KLI Hub",
  description: "Enterprise Intelligence Platform"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#060912] text-white antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
