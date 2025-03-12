export function getEnvVariable(key: string): string {
  const value = process.env[key]

  if (!value) {
    // In development, provide more helpful error messages
    if (process.env.NODE_ENV === "development") {
      console.error(
        `Environment variable ${key} is not set. Make sure it's defined in your .env.local file or environment.`,
      )
    }
    throw new Error(`Environment variable ${key} is not defined`)
  }

  return value
}

// Function to check if all required environment variables are set
export function checkRequiredEnvVars(): { valid: boolean; missing: string[] } {
  const requiredVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"]

  const missing = requiredVars.filter((key) => {
    const value = process.env[key]
    return !value || value.trim() === ""
  })

  return {
    valid: missing.length === 0,
    missing,
  }
}

