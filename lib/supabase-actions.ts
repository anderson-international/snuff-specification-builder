"use server"

import { createClient } from "@supabase/supabase-js"
import type { SnuffSpecification } from "@/types/supabase"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

// Create a function to get the Supabase client with admin privileges
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

export async function saveSpecification(specification: SnuffSpecification) {
  try {
    const supabase = await getSupabaseAuth()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: "You must be signed in to save a specification",
      }
    }

    // Add timestamps and user_id
    const now = new Date().toISOString()
    const dataToInsert = {
      ...specification,
      user_id: user.id,
      created_at: now,
      updated_at: now,
    }

    const { data, error } = await supabase.from("snuff_specifications").insert(dataToInsert).select()

    if (error) {
      throw new Error(`Error saving specification: ${error.message}`)
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in saveSpecification:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function updateSpecification(id: string, specification: Partial<SnuffSpecification>) {
  try {
    const supabase = await getSupabaseAuth()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: "You must be signed in to update a specification",
      }
    }

    // Add updated_at timestamp
    const dataToUpdate = {
      ...specification,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from("snuff_specifications")
      .update(dataToUpdate)
      .eq("id", id)
      .eq("user_id", user.id) // Ensure the user owns this specification
      .select()

    if (error) {
      throw new Error(`Error updating specification: ${error.message}`)
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        error: "Specification not found or you do not have permission to update it",
      }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in updateSpecification:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function deleteSpecification(id: string) {
  try {
    const supabase = await getSupabaseAuth()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: "You must be signed in to delete a specification",
      }
    }

    const { error } = await supabase.from("snuff_specifications").delete().eq("id", id).eq("user_id", user.id) // Ensure the user owns this specification

    if (error) {
      throw new Error(`Error deleting specification: ${error.message}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteSpecification:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function getSpecifications() {
  try {
    const supabase = await getSupabaseAuth()

    const { data, error } = await supabase
      .from("snuff_specifications")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Error fetching specifications: ${error.message}`)
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getSpecifications:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function getSpecificationsByProductId(productId: number) {
  try {
    const supabase = await getSupabaseAuth()

    const { data, error } = await supabase
      .from("snuff_specifications")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Error fetching specifications: ${error.message}`)
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getSpecificationsByProductId:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function getUserSpecifications() {
  try {
    const supabase = await getSupabaseAuth()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: "You must be signed in to view your specifications",
      }
    }

    const { data, error } = await supabase
      .from("snuff_specifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Error fetching specifications: ${error.message}`)
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getUserSpecifications:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

