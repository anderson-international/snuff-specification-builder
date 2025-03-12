import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthSetupPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Authentication Setup Guide</h1>

      <Alert className="mb-8 bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Rate Limits on Default Email Service</AlertTitle>
        <AlertDescription className="text-amber-700">
          Supabase's built-in email service has strict rate limits (2 emails per hour) [^3]. For production use, we
          recommend{" "}
          <Link href="/admin/smtp-setup" className="underline font-medium">
            setting up a custom SMTP server
          </Link>
          .
        </AlertDescription>
      </Alert>

      <Alert variant="warning" className="mb-8 bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Important: Email Template Configuration Required</AlertTitle>
        <AlertDescription className="text-amber-700">
          You must configure the Supabase email templates to send OTP codes instead of magic links. Follow the
          instructions below to complete the setup.
        </AlertDescription>
      </Alert>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Setting Up OTP Authentication in Supabase</CardTitle>
            <CardDescription>
              Follow these steps to configure Supabase to use OTP (One-Time Password) instead of magic links
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">1. Access Supabase Authentication Settings</h3>
              <p className="text-muted-foreground">
                Go to your Supabase project dashboard, then navigate to Authentication → Email Templates.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">2. Configure the OTP Email Templates</h3>
              <p className="text-muted-foreground mb-4">
                Edit <strong>both</strong> the "Confirm signup" and "Magic link" templates to use a 6-digit code format
                instead of a link.
              </p>

              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">Example Template:</h4>
                <pre className="text-sm whitespace-pre-wrap">
                  {`<h2>Your verification code</h2>
<p>Hello,</p>
<p>Your verification code for Snuff Specification Builder is:</p>
<div style="margin: 24px 0; padding: 16px; background-color: #f4f4f4; border-radius: 4px; font-size: 24px; text-align: center; letter-spacing: 4px; font-family: monospace;">
  {{ .Token }}
</div>
<p>This code will expire in 10 minutes.</p>
<p>If you didn't request this code, you can safely ignore this email.</p>
<p>Thanks,<br>The Snuff Specification Builder Team</p>`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">3. Update Site URL</h3>
              <p className="text-muted-foreground">
                In Authentication → URL Configuration, make sure your Site URL is set to your production URL, not
                localhost.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">4. Test the Authentication Flow</h3>
              <p className="text-muted-foreground">
                Try signing in with an email address. You should receive an email with a 6-digit code instead of a magic
                link.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting</CardTitle>
            <CardDescription>Common issues and how to resolve them</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Still receiving magic links instead of OTP codes?</h3>
              <p className="text-muted-foreground">
                Make sure you've updated <strong>both</strong> the "Confirm signup" and "Magic link" email templates in
                Supabase. The changes may take a few minutes to propagate.
              </p>
            </div>

            <div>
              <h3 className="font-medium">Links pointing to localhost?</h3>
              <p className="text-muted-foreground">
                Update your Site URL in Authentication → URL Configuration to your production URL.
              </p>
            </div>

            <div>
              <h3 className="font-medium">OTP verification not working?</h3>
              <p className="text-muted-foreground">
                Make sure you're using the correct email address and entering the code exactly as it appears in the
                email.
              </p>
            </div>

            <div>
              <h3 className="font-medium">Supabase branding in emails?</h3>
              <p className="text-muted-foreground">
                You can customize the email sender name and remove Supabase branding in Authentication → Email Templates
                → Settings.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom SMTP Setup</CardTitle>
            <CardDescription>Remove rate limits by using your own email service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Supabase's default email service has a rate limit of 2 emails per hour [^3], which can cause issues in
              production. Setting up a custom SMTP server will remove these limitations.
            </p>
            <div className="flex justify-center">
              <Link href="/admin/smtp-setup">
                <Button>SMTP Setup Guide</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

