"use client"

import OtpAuthForm from "@/components/auth/otp-auth-form"
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SignInPage() {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Check if user is already authenticated
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // If already authenticated, redirect to products page
      if (session) {
        router.push("/")
      } else {
        setLoading(false)
      }
    }

    checkSession()
  }, [supabase, router])

  if (loading) {
    return <div className="container mx-auto py-10 px-4 text-center">Loading...</div>
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Snuff Specification Builder</h1>
        <p className="text-muted-foreground">
          Sign in with your email to access the application and view our product catalog.
        </p>
      </div>

      {/* Rate limit warning for users */}
      <div className="max-w-md mx-auto mb-6">
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Email Rate Limits</AlertTitle>
          <AlertDescription className="text-amber-700">
            Our authentication system is limited to 2 emails per hour. If you don't receive a code, please wait before
            trying again.
          </AlertDescription>
        </Alert>
      </div>

      <OtpAuthForm />

      {/* Narrower dropdown with improved readability, centered under the sign-in box */}
      <div className="max-w-md mx-auto mt-12 flex justify-center">
        <div className="w-4/5 border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setIsPrivacyOpen(!isPrivacyOpen)}
            className="flex w-full justify-between items-center p-2.5 text-left bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
          >
            <h3 className="text-sm font-medium">How we protect your privacy</h3>
            <div className="text-gray-500">
              {isPrivacyOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </button>

          {isPrivacyOpen && (
            <div className="px-3 py-3 border-t border-gray-300 bg-white">
              <div className="text-sm space-y-2 text-gray-700">
                <p>
                  Your privacy matters. Your email is only used for authentication and will not be stored or used for
                  marketing purposes.
                </p>
                <p>
                  We use a secure, passwordless authentication system that sends a one-time code to your email. This
                  approach is more secure than traditional passwords.
                </p>
                <p>
                  <strong>Anonymous Access:</strong> If you're not registered in our system, you'll still be able to
                  browse products after authentication, but with limited access to administrative features.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

