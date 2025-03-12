"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, UserIcon, ChevronDown, Shield } from "lucide-react"
import Link from "next/link"

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ full_name: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single()

        if (profile) {
          setProfile(profile)
        }
      }

      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("full_name, role")
          .eq("id", session.user.id)
          .single()

        if (profile) {
          setProfile(profile)
        }
      } else {
        setProfile(null)
      }

      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/signin")
  }

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        Loading...
      </Button>
    )
  }

  // If no user is logged in, return null (no button needed since root is sign-in page)
  if (!user) {
    return null
  }

  const displayName = profile?.full_name || user.email?.split("@")[0] || "User"
  const initials = displayName.substring(0, 2).toUpperCase()
  const isAdmin = profile?.role === "admin"

  return (
    <div className="flex items-center gap-3">
      {/* Admin button - only visible to admin users */}
      {isAdmin && (
        <Link href="/admin">
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Admin</span>
          </Button>
        </Link>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline-block">{displayName}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-red-600 cursor-pointer">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

