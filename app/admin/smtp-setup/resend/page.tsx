"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, ExternalLink, Copy, Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"

export default function ResendSetupPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/smtp-setup" className="text-sm text-muted-foreground hover:underline">
          ← Back to SMTP Setup
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Setting Up Resend with Supabase</h1>
        <div className="relative h-8 w-8">
          <Image src="/placeholder.svg?height=32&width=32" alt="Resend logo" fill className="object-contain" />
        </div>
      </div>

      <Alert className="mb-8 bg-blue-50 border-blue-200">
        <CheckCircle2 className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Resend is a great choice</AlertTitle>
        <AlertDescription className="text-blue-700">
          Resend offers a modern email API with excellent deliverability, a generous free tier (100 emails/day,
          3,000/month), and a developer-friendly interface.
        </AlertDescription>
      </Alert>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Create a Resend Account</CardTitle>
            <CardDescription>Sign up for Resend and set up your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <p>
                  Go to{" "}
                  <a
                    href="https://resend.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center"
                  >
                    Resend.com <ExternalLink className="h-3 w-3 ml-1" />
                  </a>{" "}
                  and click "Sign Up"
                </p>
              </li>
              <li>
                <p>Create an account using your email, Google, or GitHub</p>
              </li>
              <li>
                <p>Verify your email address by clicking the link sent to your inbox</p>
              </li>
              <li>
                <p>Complete the onboarding process by providing your name and organization details</p>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Add and Verify Your Domain</CardTitle>
            <CardDescription>Set up a custom domain for better deliverability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              For the best deliverability, you should send emails from your own domain rather than using Resend's shared
              domains.
            </p>

            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <p>In the Resend dashboard, navigate to "Domains" in the left sidebar</p>
              </li>
              <li>
                <p>Click "Add Domain" and enter your domain name (e.g., yourdomain.com)</p>
              </li>
              <li>
                <p>Resend will provide you with DNS records that you need to add to your domain's DNS settings:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>SPF record (TXT record)</li>
                  <li>DKIM record (CNAME record)</li>
                  <li>Return-Path record (MX record)</li>
                </ul>
              </li>
              <li>
                <p>
                  Add these records to your domain's DNS settings through your domain registrar (e.g., GoDaddy,
                  Namecheap, Cloudflare)
                </p>
              </li>
              <li>
                <p>Wait for DNS propagation (can take up to 24-48 hours, but often completes within an hour)</p>
              </li>
              <li>
                <p>Click "Verify" in the Resend dashboard to confirm your domain is properly configured</p>
              </li>
            </ol>

            <Alert className="bg-amber-50 border-amber-200 mt-4">
              <AlertTitle className="text-amber-800">Important</AlertTitle>
              <AlertDescription className="text-amber-700">
                Domain verification is crucial for good email deliverability. Without it, your emails are more likely to
                be marked as spam.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 3: Get Your SMTP Credentials</CardTitle>
            <CardDescription>Obtain the SMTP settings needed for Supabase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Resend provides SMTP credentials that you'll need to configure in Supabase:</p>

            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <p>In the Resend dashboard, go to "API Keys" in the left sidebar</p>
              </li>
              <li>
                <p>Click "Create API Key" and give it a name like "Supabase Auth"</p>
              </li>
              <li>
                <p>Copy the generated API key (you'll only see it once)</p>
              </li>
              <li>
                <p>Note down the following SMTP settings for Resend:</p>
                <div className="bg-gray-100 p-4 rounded-md mt-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <p>
                      <strong>SMTP Host:</strong> smtp.resend.com
                    </p>
                    <CopyButton text="smtp.resend.com" />
                  </div>
                  <div className="flex justify-between items-center">
                    <p>
                      <strong>SMTP Port:</strong> 465
                    </p>
                    <CopyButton text="465" />
                  </div>
                  <div className="flex justify-between items-center">
                    <p>
                      <strong>SMTP Username:</strong> resend
                    </p>
                    <CopyButton text="resend" />
                  </div>
                  <div className="flex justify-between items-center">
                    <p>
                      <strong>SMTP Password:</strong> [Your API Key]
                    </p>
                  </div>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 4: Configure Supabase SMTP Settings</CardTitle>
            <CardDescription>Add your Resend SMTP credentials to Supabase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <p>Log in to your Supabase dashboard and select your project</p>
              </li>
              <li>
                <p>
                  Navigate to <strong>Authentication → Email Templates → Settings</strong>
                </p>
              </li>
              <li>
                <p>
                  Toggle <strong>Custom SMTP</strong> to enabled
                </p>
              </li>
              <li>
                <p>Enter the following settings:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>
                    <strong>Sender Name:</strong> Your application name (e.g., "Snuff Specification Builder")
                  </li>
                  <li>
                    <strong>Sender Email:</strong> An email address from your verified domain (e.g.,
                    noreply@yourdomain.com)
                  </li>
                  <li>
                    <strong>SMTP Host:</strong> smtp.resend.com
                  </li>
                  <li>
                    <strong>SMTP Port:</strong> 465
                  </li>
                  <li>
                    <strong>SMTP Username:</strong> resend
                  </li>
                  <li>
                    <strong>SMTP Password:</strong> [Your Resend API Key]
                  </li>
                  <li>
                    Enable <strong>TLS encryption</strong>
                  </li>
                </ul>
              </li>
              <li>
                <p>
                  Click <strong>Save</strong>
                </p>
              </li>
            </ol>

            <div className="bg-gray-100 p-4 rounded-md mt-4">
              <p className="font-medium">Example Configuration:</p>
              <div className="mt-2 space-y-1">
                <p>
                  <strong>Sender Name:</strong> Snuff Specification Builder
                </p>
                <p>
                  <strong>Sender Email:</strong> auth@yourdomain.com
                </p>
                <p>
                  <strong>SMTP Host:</strong> smtp.resend.com
                </p>
                <p>
                  <strong>SMTP Port:</strong> 465
                </p>
                <p>
                  <strong>SMTP Username:</strong> resend
                </p>
                <p>
                  <strong>SMTP Password:</strong> re_1a2b3c4d5e6f7g8h9i0j...
                </p>
                <p>
                  <strong>TLS encryption:</strong> Enabled
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 5: Test Your SMTP Configuration</CardTitle>
            <CardDescription>Verify that your setup is working correctly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <p>
                  In the Supabase dashboard, after saving your SMTP settings, click the <strong>Send test email</strong>{" "}
                  button
                </p>
              </li>
              <li>
                <p>
                  Enter your email address and click <strong>Send</strong>
                </p>
              </li>
              <li>
                <p>Check your inbox for the test email (also check spam/junk folders)</p>
              </li>
              <li>
                <p>If you receive the test email, your SMTP configuration is working correctly</p>
              </li>
              <li>
                <p>
                  Test the actual authentication flow in your application by trying to sign in with an email address
                </p>
              </li>
            </ol>

            <Alert className="bg-green-50 border-green-200 mt-4">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">No More Rate Limits!</AlertTitle>
              <AlertDescription className="text-green-700">
                With Resend configured, you're no longer subject to Supabase's 2 emails per hour limit. Resend's free
                tier allows 100 emails per day and 3,000 per month.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting</CardTitle>
            <CardDescription>Common issues and how to resolve them</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Test email not received</h3>
              <p className="text-muted-foreground">
                Double-check your SMTP credentials, especially the API key. Make sure your domain is properly verified
                in Resend.
              </p>
            </div>

            <div>
              <h3 className="font-medium">Emails going to spam</h3>
              <p className="text-muted-foreground">
                Ensure your domain is properly verified with all DNS records (SPF, DKIM, and Return-Path) correctly set
                up.
              </p>
            </div>

            <div>
              <h3 className="font-medium">Authentication errors</h3>
              <p className="text-muted-foreground">
                Make sure you're using "resend" as the username and your API key as the password. Check that you're
                using port 465 with TLS enabled.
              </p>
            </div>

            <div>
              <h3 className="font-medium">Sender email issues</h3>
              <p className="text-muted-foreground">
                The sender email must be from a domain that you've verified in Resend. You cannot use gmail.com,
                outlook.com, or other public domains.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link href="https://resend.com/docs/dashboard/domains/introduction" target="_blank" rel="noopener noreferrer">
            <Button className="mr-4">
              Resend Documentation <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/admin/auth-setup">
            <Button variant="outline">Back to Auth Setup</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Copy button component with state
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 w-8 p-0">
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
}

