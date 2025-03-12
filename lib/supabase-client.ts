"use client"

import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with anon key for client-side operations
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables. Please check your environment configuration.")

    // Return a dummy client that will show appropriate errors
    return createClient("https://placeholder-url.supabase.co", "placeholder-key", {
      auth: {
        persistSession: false,
      },
    })
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Export a pre-initialized client for convenience
export const supabase = getSupabaseClient()

