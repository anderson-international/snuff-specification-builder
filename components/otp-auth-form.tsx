"use client"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Loader2, AlertCircle, ExternalLink } from "lucide-react"
import { sendOtpCode, verifyOtpCode } from "@/lib/auth-actions"
import { useActionState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Initial state for the form
const initialState = {
  success: false,
  error: null,
  email: "",
  isRateLimit: false,
  waitTime: 0,
}

export default function OtpAuthForm() {
  const [codeSent, setCodeSent] = useState(false)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [cooldown, setCooldown] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [showRateLimitInfo, setShowRateLimitInfo] = useState(false)

  const [sendState, sendAction] = useActionState(async (state, formData) => {
    const result = await sendOtpCode(formData)

    if (result.success) {
      setCodeSent(true)
      setEmail(result.email || "")
      // Start cooldown timer to prevent rapid requests
      setCooldown(60)
      toast({
        title: "Verification code sent",
        description: "Please check your email for the 6-digit code",
      })
    } else {
      if (result.isRateLimit && result.waitTime) {
        // Set cooldown timer based on the rate limit
        setCooldown(result.waitTime)
        setShowRateLimitInfo(true)
      }

      toast({
        title: "Failed to send code",
        description: result.error || "An unknown error occurred",
        variant: "destructive",
      })
    }

    return result
  }, initialState)

  const router = useRouter()

  const [verifyState, verifyAction] = useActionState(async (state, formData) => {
    const result = await verifyOtpCode(formData)

    if (result.success) {
      // Handle successful verification on the client side
      toast({
        title: "Signed in successfully",
        description: "Welcome to Snuff Specification Builder!",
      })

      // Use router to redirect after successful verification
      router.push("/")
      router.refresh()
      return { success: true }
    } else {
      toast({
        title: "Verification failed",
        description: result.error || "An unknown error occurred",
        variant: "destructive",
      })
      return result
    }
  }, initialState)

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown <= 0) return

    const timer = setTimeout(() => {
      setCooldown((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearTimeout(timer)
  }, [cooldown])

  const handleBackToEmail = () => {
    setCodeSent(false)
    setOtp("")
  }

  const handleResendCode = () => {
    if (cooldown > 0) return

    // Use startTransition to wrap the action call
    startTransition(() => {
      const formData = new FormData()
      formData.append("email", email)
      sendAction(formData)
    })
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
        <form action={sendAction} id="login-form">
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

            {showRateLimitInfo && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Email Rate Limit Reached</AlertTitle>
                <AlertDescription className="text-blue-700">
                  <p className="mb-2">
                    Supabase's default email service is limited to 2 emails per hour. For production use, an admin
                    should{" "}
                    <Link href="/admin/smtp-setup" className="underline font-medium">
                      set up a custom SMTP server
                    </Link>
                    .
                  </p>
                  <p className="text-xs">
                    <Link
                      href="https://supabase.com/docs/guides/auth/auth-smtp"
                      className="flex items-center text-blue-600"
                    >
                      Learn more about Supabase email limits
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={sendState.pending || cooldown > 0}>
              {sendState.pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {cooldown > 0 ? `Wait ${cooldown}s` : "Send Verification Code"}
            </Button>
          </CardFooter>
        </form>
      ) : (
        <form action={verifyAction} id="verification-form">
          <CardContent className="space-y-4">
            <input type="hidden" name="email" value={email} />
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
            <Button type="submit" className="w-full">
              {verifyState.pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Code
            </Button>
            <div className="flex gap-2 w-full">
              <Button type="button" variant="ghost" className="w-full" onClick={handleBackToEmail}>
                Back
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResendCode}
                disabled={cooldown > 0 || isPending}
              >
                {isPending || sendState.pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
              </Button>
            </div>
          </CardFooter>
        </form>
      )}
    </Card>
  )
}

