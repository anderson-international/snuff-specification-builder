import ProductList from "@/components/product-list"
import ReliableEnvChecker from "@/components/reliable-env-checker"
import { fetchShopifyProducts } from "@/lib/shopify"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Home() {
  // Check if user is authenticated
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If not authenticated, redirect to sign-in page
  if (!session) {
    redirect("/auth/signin")
  }

  // Fetch products for authenticated users
  const { products, error } = await fetchShopifyProducts()

  // Check if user is admin
  const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", session.user.id).single()

  const isAdmin = profile?.role === "admin"

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Snuff Specification Builder</h1>
        {isAdmin && (
          <Link href="/setup">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Setup
            </Button>
          </Link>
        )}
      </div>

      <ReliableEnvChecker />

      <ProductList initialProducts={products || []} error={error} />
    </main>
  )
}

