import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Solar Bright - Renewable Energy Solutions",
  description: "Harness the power of the sun and take control of your energy consumption with Solar Bright",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#f5f5f0] flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex-grow w-full">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
