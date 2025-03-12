import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes that require authentication
const protectedRoutes = ["/", "/specification", "/admin"]

// Define admin-only routes
const adminRoutes = ["/admin", "/setup", "/debug"]

// Define public routes that don't require authentication
const publicRoutes = ["/auth/signin", "/auth/callback"]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname

  // Allow access to public routes without authentication
  if (publicRoutes.some((route) => path.startsWith(route))) {
    return res
  }

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => path === route || path.startsWith(route))

  // Check if the path is an admin-only route
  const isAdminRoute = adminRoutes.some((route) => path === route || path.startsWith(route))

  // If it's a protected route and user is not authenticated, redirect to sign in
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/auth/signin", req.url)
    redirectUrl.searchParams.set("redirectedFrom", path)
    return NextResponse.redirect(redirectUrl)
  }

  // If it's an admin route, check if the user is an admin
  if (isAdminRoute && session) {
    const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", session.user.id).single()

    // If not an admin, redirect to home
    if (!profile || profile.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return res
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
}

