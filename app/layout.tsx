import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import UserProfile from "@/components/auth/user-profile"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Snuff Specification Builder",
  description: "Build and manage snuff specifications",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <header className="border-b">
              <div className="container mx-auto py-4 px-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Snuff Specification Builder</h1>
                <div className="flex items-center gap-4">
                  <UserProfile />
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-4 text-center text-sm text-muted-foreground">
              <div className="container mx-auto">&copy; {new Date().getFullYear()} Snuff Specification Builder</div>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

