"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Loader2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function PasswordlessAuthForm() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown <= 0) return

    const timer = setTimeout(() => {
      setCooldown((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearTimeout(timer)
  }, [cooldown])

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cooldown > 0) {
      toast({
        title: "Rate limit",
        description: `Please wait ${cooldown} seconds before requesting another code`,
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Force OTP mode with explicit options
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          channel: "email",
          emailRedirectTo: undefined,
          // This is important - it tells Supabase to use OTP
          flowType: "pkce",
        },
      })

      if (error) {
        // Check for rate limiting error
        if (error.message.includes("security purposes") && error.message.includes("seconds")) {
          // Extract the wait time from the error message
          const waitTimeMatch = error.message.match(/(\d+) seconds/)
          const waitTime = waitTimeMatch ? Number.parseInt(waitTimeMatch[1]) : 60
          setCooldown(waitTime)
          throw new Error(`Rate limit exceeded. Please wait ${waitTime} seconds before requesting another code.`)
        }
        throw error
      }

      // Set default cooldown
      setCooldown(60)
      setCodeSent(true)
      toast({
        title: "Verification code sent",
        description: "Please check your email for the 6-digit code",
      })
    } catch (error) {
      console.error("Authentication error:", error)
      toast({
        title: "Failed to send code",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      })

      if (error) throw error

      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      })

      // Use router to redirect after successful verification
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Verification error:", error)
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Calculate progress percentage for cooldown
  const cooldownProgress = cooldown > 0 ? ((60 - cooldown) / 60) * 100 : 100

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          {codeSent ? "Enter the 6-digit code sent to your email" : "Enter your email to receive a sign-in code"}
        </CardDescription>
      </CardHeader>
      {!codeSent ? (
        <form onSubmit={handleSendCode} method="post" id="login-form">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="username email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {cooldown > 0 && (
              <div className="space-y-2">
                <Alert variant="warning" className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-700">
                    Please wait {cooldown} seconds before requesting another code
                  </AlertDescription>
                </Alert>
                <Progress value={cooldownProgress} className="h-2" />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading || cooldown > 0}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {cooldown > 0 ? `Wait ${cooldown}s` : "Send Verification Code"}
            </Button>
          </CardFooter>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} method="post" id="verification-form">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                name="otp"
                type="text"
                autoComplete="one-time-code"
                inputMode="numeric"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                pattern="[0-9]{6}"
                required
              />
              <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to {email}</p>
            </div>

            {cooldown > 0 && (
              <div className="text-sm text-muted-foreground">You can request a new code in {cooldown} seconds</div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Code
            </Button>
            <div className="flex gap-2 w-full">
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setCodeSent(false)}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleSendCode}
                disabled={loading || cooldown > 0}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
              </Button>
            </div>
          </CardFooter>
        </form>
      )}
    </Card>
  )
}

