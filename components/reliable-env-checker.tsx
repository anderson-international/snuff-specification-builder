"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function ReliableEnvChecker() {
  const [envStatus, setEnvStatus] = useState<{ [key: string]: boolean }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // This is a more reliable way to check environment variables on the client
    const checkEnvVars = async () => {
      try {
        // Make a request to a server endpoint that will check the environment variables
        const response = await fetch("/api/check-env")
        const data = await response.json()

        setEnvStatus(data.variables)
      } catch (error) {
        console.error("Failed to check environment variables:", error)
      } finally {
        setLoading(false)
      }
    }

    checkEnvVars()
  }, [])

  if (loading) {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Checking environment variables...</AlertTitle>
      </Alert>
    )
  }

  const missingVars = Object.entries(envStatus)
    .filter(([_, isSet]) => !isSet)
    .map(([key]) => key)

  if (missingVars.length === 0) {
    // Return null when all environment variables are set
    return null
  }

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
        <p className="mt-2">Please make sure these variables are properly set in your environment.</p>
      </AlertDescription>
    </Alert>
  )
}

