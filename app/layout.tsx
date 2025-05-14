import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SportMatch - Encuentra Tu Compañero Deportivo",
  description: "Conéctate con personas que comparten tu pasión por los deportes",
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} overflow-x-hidden`}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
        {children}
      </ThemeProvider>
      </body>
      </html>
  )
}
