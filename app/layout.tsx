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
      <head>
        {/* Inline critical CSS to prevent black screen */}
        <style dangerouslySetInnerHTML={{
          __html: `
          html, body { 
            min-height: 100vh; 
            background-color: #060912; 
            color: #ffffff;
            margin: 0;
            padding: 0;
          }
          .loading-fallback {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #060912;
          }
        `}} />
      </head>
      <body className="bg-[#060912] text-white antialiased min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
