import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { DashboardProvider } from "@/components/dashboard-context"
import { Toaster } from "sonner"
import 'leaflet/dist/leaflet.css'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AgriGoo - AI-Powered Crop Disease Detection",
  description:
    "Crop disease detection made easy. Upload, analyze, and get results with 99.3% accuracy. Trusted by 15,000+ farmers worldwide.",
  generator: "AgriGoo",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} antialiased`}>
        <DashboardProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster richColors position="top-right" />
        </DashboardProvider>
      </body>
    </html>
  )
}
