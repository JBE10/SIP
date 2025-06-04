import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppProvider } from "@/context/app-context"
import { AuthProvider } from "@/context/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SportMatch - Encuentra compañeros deportivos",
  description: "Conecta con personas que comparten tus intereses deportivos en Buenos Aires",
  generator: "v0.dev",
}

export default function RootLayout({children,}: Readonly<{children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <AppProvider>{children}</AppProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
