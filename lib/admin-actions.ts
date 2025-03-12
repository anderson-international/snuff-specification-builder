"use server"

import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { UserWithProfile } from "@/types/user"
import { isAdmin } from "./auth-utils"

// Create a function to get the Supabase admin client
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables. Please check your .env file or environment configuration.")
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// Get the authenticated Supabase client
async function getSupabaseAuth() {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}

export async function createUser({
  email,
  full_name,
  role,
}: {
  email: string
  full_name: string
  role: "admin" | "user"
}) {
  try {
    const supabase = await getSupabaseAuth()

    // Check if the current user is an admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: "You must be signed in to create users",
      }
    }

    const isUserAdmin = await isAdmin(user.id)

    if (!isUserAdmin) {
      return {
        success: false,
        error: "Only administrators can create users",
      }
    }

    // Use admin client to create user
    const adminClient = getSupabaseAdmin()

    // Create the user in auth.users
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name },
    })

    if (authError) {
      throw new Error(`Error creating user: ${authError.message}`)
    }

    if (!authUser.user) {
      throw new Error("Failed to create user")
    }

    // Create the user profile
    const { error: profileError } = await adminClient.from("user_profiles").insert({
      id: authUser.user.id,
      full_name,
      role,
    })

    if (profileError) {
      // If profile creation fails, try to delete the auth user
      await adminClient.auth.admin.deleteUser(authUser.user.id)
      throw new Error(`Error creating user profile: ${profileError.message}`)
    }

    // Return the created user
    const newUser: UserWithProfile = {
      id: authUser.user.id,
      email: authUser.user.email || "",
      full_name,
      role,
      created_at: new Date().toISOString(),
    }

    return {
      success: true,
      user: newUser,
    }
  } catch (error) {
    console.error("Error in createUser:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function deleteUser(userId: string) {
  try {
    const supabase = await getSupabaseAuth()

    // Check if the current user is an admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: "You must be signed in to delete users",
      }
    }

    const isUserAdmin = await isAdmin(user.id)

    if (!isUserAdmin) {
      return {
        success: false,
        error: "Only administrators can delete users",
      }
    }

    // Use admin client to delete user
    const adminClient = getSupabaseAdmin()

    // Delete the user
    const { error } = await adminClient.auth.admin.deleteUser(userId)

    if (error) {
      throw new Error(`Error deleting user: ${error.message}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteUser:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function updateUserRole(userId: string, role: "admin" | "user") {
  try {
    const supabase = await getSupabaseAuth()

    // Check if the current user is an admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: "You must be signed in to update user roles",
      }
    }

    const isUserAdmin = await isAdmin(user.id)

    if (!isUserAdmin) {
      return {
        success: false,
        error: "Only administrators can update user roles",
      }
    }

    // Update the user profile
    const { error } = await supabase
      .from("user_profiles")
      .update({
        role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      throw new Error(`Error updating user role: ${error.message}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error in updateUserRole:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function createFirstAdmin({
  email,
  full_name,
}: {
  email: string
  full_name: string
}) {
  try {
    const adminClient = getSupabaseAdmin()

    // Check if there are any users
    const { count, error: countError } = await adminClient
      .from("user_profiles")
      .select("*", { count: "exact", head: true })

    if (countError) {
      throw new Error(`Error checking users: ${countError.message}`)
    }

    if (count && count > 0) {
      return {
        success: false,
        error: "Cannot create first admin: users already exist",
      }
    }

    // Create the user in auth.users
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name },
    })

    if (authError) {
      throw new Error(`Error creating admin user: ${authError.message}`)
    }

    if (!authUser.user) {
      throw new Error("Failed to create admin user")
    }

    // Create the user profile
    const { error: profileError } = await adminClient.from("user_profiles").insert({
      id: authUser.user.id,
      full_name,
      role: "admin",
    })

    if (profileError) {
      // If profile creation fails, try to delete the auth user
      await adminClient.auth.admin.deleteUser(authUser.user.id)
      throw new Error(`Error creating admin profile: ${profileError.message}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error in createFirstAdmin:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

