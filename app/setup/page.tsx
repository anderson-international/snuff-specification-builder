"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { setupSnuffSpecificationsTable } from "@/lib/setup-supabase-alt"
import { toast } from "@/hooks/use-toast"
import { Loader2, AlertCircle, CheckCircle2, Copy, Check } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [needsManualSetup, setNeedsManualSetup] = useState(false)
  const [message, setMessage] = useState("")
  const [copied, setCopied] = useState(false)

  // SQL code for creating the table
  const sqlCode = `-- Create the table
CREATE TABLE IF NOT EXISTS snuff_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id BIGINT NOT NULL,
  product_title TEXT NOT NULL,
  ease_of_use TEXT NOT NULL,
  nicotine_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_snuff_specifications_product_id 
ON snuff_specifications(product_id);

-- Enable row level security
ALTER TABLE snuff_specifications ENABLE ROW LEVEL SECURITY;

-- Create read policy
CREATE POLICY "Allow anonymous read access" 
ON snuff_specifications FOR SELECT 
USING (true);

-- Create insert policy
CREATE POLICY "Allow authenticated insert" 
ON snuff_specifications FOR INSERT 
WITH CHECK (true);`

  // Check if the table exists on page load
  useEffect(() => {
    const checkTable = async () => {
      setIsLoading(true)
      try {
        const result = await setupSnuffSpecificationsTable()
        if (result.success) {
          setIsComplete(true)
          setMessage(result.message)
        } else {
          setNeedsManualSetup(true)
          setMessage(result.message)
        }
      } catch (error) {
        console.error("Error checking table:", error)
        setNeedsManualSetup(true)
        setMessage(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    checkTable()
  }, [])

  const handleCopySQL = () => {
    navigator.clipboard
      .writeText(sqlCode)
      .then(() => {
        setCopied(true)
        toast({
          title: "SQL copied to clipboard",
          description: "You can now paste it into the Supabase SQL Editor",
        })
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy SQL:", err)
        toast({
          title: "Failed to copy",
          description: "Please try selecting and copying the text manually",
          variant: "destructive",
        })
      })
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Snuff Specification Builder Setup</CardTitle>
          <CardDescription>Set up your Supabase database for storing snuff specifications</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Checking database...</span>
            </div>
          ) : isComplete ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Setup Complete</AlertTitle>
              <AlertDescription className="text-green-700">{message}</AlertDescription>
            </Alert>
          ) : needsManualSetup ? (
            <>
              <Alert className="bg-amber-50 border-amber-200 mb-6">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Manual Setup Required</AlertTitle>
                <AlertDescription className="text-amber-700">{message}</AlertDescription>
              </Alert>

              <div className="prose max-w-none">
                <h3 className="text-lg font-medium mb-2">Manual Setup Instructions</h3>
                <p>Follow these steps to create the required table in your Supabase project:</p>

                <ol className="list-decimal pl-6 space-y-4 my-4">
                  <li>
                    <p>Log in to your Supabase dashboard and open your project.</p>
                  </li>
                  <li>
                    <p>Go to the SQL Editor.</p>
                  </li>
                  <li>
                    <p>Copy the following SQL code:</p>
                    <div className="relative">
                      <div className="absolute right-2 top-2 z-10">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopySQL}
                          className="h-8 w-8 p-0 bg-gray-800 border-gray-700 hover:bg-gray-700 text-green-400"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <pre className="bg-black text-green-400 p-4 rounded-md overflow-x-auto text-sm font-mono border border-gray-800">
                        {sqlCode}
                      </pre>
                    </div>
                  </li>
                  <li>
                    <p>Click "Run" to execute the SQL code.</p>
                  </li>
                  <li>
                    <p>After running the SQL, click the button below to verify the setup.</p>
                  </li>
                </ol>
              </div>
            </>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {isComplete ? (
            <Link href="/" className="w-full">
              <Button className="w-full">Go to Product List</Button>
            </Link>
          ) : needsManualSetup ? (
            <Button onClick={() => window.location.reload()} className="w-full">
              Verify Setup
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  )
}

