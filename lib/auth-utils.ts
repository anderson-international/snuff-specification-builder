"use server"

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    const { data, error } = await supabase.from("user_profiles").select("role").eq("id", userId).single()

    if (error || !data) {
      console.error("Error checking admin status:", error)
      return false
    }

    return data.role === "admin"
  } catch (error) {
    console.error("Error in isAdmin:", error)
    return false
  }
}

export async function getCurrentUserWithProfile() {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    const { data: profile, error } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

    if (error || !profile) {
      console.error("Error fetching user profile:", error)
      return {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || "User",
        role: "user" as const,
      }
    }

    return {
      id: user.id,
      email: user.email,
      full_name: profile.full_name,
      role: profile.role,
    }
  } catch (error) {
    console.error("Error in getCurrentUserWithProfile:", error)
    return null
  }
}

