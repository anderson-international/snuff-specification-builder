import type React from "react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/auth-utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, Settings, Database, Bug } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated and is an admin
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  // Check if user is an admin
  const userIsAdmin = await isAdmin(user.id)

  if (!userIsAdmin) {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Admin sidebar navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Admin Dashboard</h2>
            <nav className="space-y-2">
              <Link href="/admin" className="w-full">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </Button>
              </Link>
              <Link href="/setup" className="w-full">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Database className="mr-2 h-4 w-4" />
                  Database Setup
                </Button>
              </Link>
              <Link href="/admin/auth-setup" className="w-full">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Auth Setup
                </Button>
              </Link>
              {process.env.NODE_ENV === "development" && (
                <Link href="/debug" className="w-full">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Bug className="mr-2 h-4 w-4" />
                    Debug
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

