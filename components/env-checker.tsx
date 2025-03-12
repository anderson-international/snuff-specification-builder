"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function EnvChecker() {
  const [missingVars, setMissingVars] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const requiredVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

    // In client components, we need to access env vars through the NEXT_PUBLIC_prefix
    // and through the window.__ENV__ object if available
    const missing = requiredVars.filter((varName) => {
      // Check if the variable exists in process.env
      const value = process.env[varName]
      return !value || value.trim() === ""
    })

    setMissingVars(missing)

    // Log for debugging
    console.log("Client-side environment check:", {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set",
    })
  }, [])

  if (missingVars.length === 0) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Missing Environment Variables</AlertTitle>
      <AlertDescription>
        <p>The following environment variables are missing:</p>
        <ul className="list-disc pl-5 mt-2">
          {missingVars.map((varName) => (
            <li key={varName}>{varName}</li>
          ))}
        </ul>

        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
              {isOpen ? "Hide Troubleshooting" : "Show Troubleshooting"}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2 text-sm">
            <p>Here are some steps to fix this issue:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Verify that these variables are set in your Vercel project settings</li>
              <li>Try redeploying your application</li>
              <li>Check if the variables are properly named (case-sensitive)</li>
              <li>Make sure the variables are set in the correct environment (Production, Preview, Development)</li>
              <li>Try adding the variables to a .env.local file if running locally</li>
            </ol>
          </CollapsibleContent>
        </Collapsible>
      </AlertDescription>
    </Alert>
  )
}

