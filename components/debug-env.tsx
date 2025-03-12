"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function DebugEnv() {
  const [envVars, setEnvVars] = useState<{ [key: string]: string | undefined }>({})

  useEffect(() => {
    // Only collect environment variables that are meant to be public
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  }, [])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Environment Variables Debug</CardTitle>
        <CardDescription>Checking if environment variables are properly loaded</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(envVars).map(([key, value]) => (
            <Alert key={key} variant={value ? "default" : "destructive"}>
              {value ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{key}</AlertTitle>
              <AlertDescription>
                {value ? `✅ Available (value starts with: ${value.substring(0, 3)}...)` : "❌ Not available or empty"}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

