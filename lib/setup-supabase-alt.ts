"use server"

import { createClient } from "@supabase/supabase-js"

// Create a function to get the Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables. Please check your .env file or environment configuration.")
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function setupSnuffSpecificationsTable() {
  try {
    const supabase = getSupabaseClient()

    // Check if the table exists by attempting to query it
    const { error: checkError } = await supabase.from("snuff_specifications").select("id").limit(1)

    // If there's no error, the table exists
    if (!checkError) {
      return { success: true, message: "Table already exists" }
    }

    // If we get an error that's not about the table not existing, it's a real error
    if (checkError && !checkError.message.includes("does not exist")) {
      throw checkError
    }

    // Since we can't directly create tables with the JavaScript client,
    // we'll return instructions for manual setup
    return {
      success: false,
      message: "Table does not exist. Please use the manual setup instructions to create the table.",
    }
  } catch (error) {
    console.error("Error setting up Supabase table:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

