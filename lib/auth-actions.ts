"use server"

import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

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

export async function sendOtpCode(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return {
      success: false,
      error: "Email is required",
    }
  }

  try {
    const supabase = await getSupabaseAuth()

    // Explicitly request OTP via email
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        // Force OTP mode
        channel: "email",
        emailRedirectTo: undefined,
        // This is important - it tells Supabase to use OTP
        flowType: "pkce",
      },
    })

    if (error) {
      // Check for rate limiting error - handle various error message formats
      if (
        error.message.includes("rate limit") ||
        error.message.includes("security purposes") ||
        error.message.includes("seconds")
      ) {
        // Extract the wait time from the error message if available
        const waitTimeMatch = error.message.match(/(\d+) seconds/)
        const waitTime = waitTimeMatch ? Number.parseInt(waitTimeMatch[1]) : 60

        return {
          success: false,
          error: `Email rate limit exceeded. Please wait ${waitTime} seconds before requesting another code.`,
          isRateLimit: true,
          waitTime,
        }
      }

      throw error
    }

    return {
      success: true,
      email,
    }
  } catch (error) {
    console.error("Error sending OTP:", error)

    // Check if the error is a rate limit error (as a fallback)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    if (errorMessage.toLowerCase().includes("rate limit")) {
      return {
        success: false,
        error:
          "Email rate limit exceeded. Please try again later or contact an administrator to set up a custom SMTP server.",
        isRateLimit: true,
        waitTime: 60, // Default to 60 seconds if we can't extract the exact time
      }
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

export async function verifyOtpCode(formData: FormData) {
  const email = formData.get("email") as string
  const otp = formData.get("otp") as string

  if (!email || !otp) {
    return {
      success: false,
      error: "Email and OTP code are required",
    }
  }

  try {
    const supabase = await getSupabaseAuth()

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    })

    if (error) {
      throw error
    }

    // Check if the user has a profile in the user_profiles table
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("id, role")
      .eq("id", data.user?.id)
      .single()

    // If no profile exists, this is an anonymous user
    // They will still be authenticated but won't have admin privileges
    if (profileError && profileError.code === "PGRST116") {
      console.log("Anonymous user authenticated:", data.user?.email)
    }

    // Instead of redirecting, return success and let the client handle the redirect
    return {
      success: true,
      data,
      isAnonymous: !profile,
    }
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

