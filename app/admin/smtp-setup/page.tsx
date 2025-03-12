import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SmtpSetupPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Custom SMTP Setup Guide</h1>

      <Alert className="mb-8 bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Important: Custom SMTP Required for Production</AlertTitle>
        <AlertDescription className="text-amber-700">
          Supabase's built-in email service has strict rate limits (2 emails per hour) and is not meant for production
          use [^3]. Setting up a custom SMTP server will remove these limitations.
        </AlertDescription>
      </Alert>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Setting Up Custom SMTP in Supabase</CardTitle>
            <CardDescription>
              Follow these steps to configure a custom SMTP server for your Supabase project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">1. Choose an SMTP Provider</h3>
              <p className="text-muted-foreground mb-4">
                Select an email service provider that offers SMTP. Here are some popular options:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Resend</strong> - Modern email API with excellent deliverability
                </li>
                <li>
                  <strong>SendGrid</strong> - Popular email service with generous free tier
                </li>
                <li>
                  <strong>Mailgun</strong> - Developer-focused email service
                </li>
                <li>
                  <strong>Amazon SES</strong> - Cost-effective for high volume
                </li>
                <li>
                  <strong>Postmark</strong> - Known for high deliverability
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">2. Get Your SMTP Credentials</h3>
              <p className="text-muted-foreground">From your email service provider, you'll need:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>SMTP Host (e.g., smtp.sendgrid.net)</li>
                <li>SMTP Port (usually 587 or 465)</li>
                <li>SMTP Username</li>
                <li>SMTP Password or API Key</li>
                <li>Sender Email Address</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">3. Configure Supabase SMTP Settings</h3>
              <p className="text-muted-foreground mb-4">
                Go to your Supabase dashboard and configure the SMTP settings:
              </p>
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  Go to <strong>Authentication → Email Templates → Settings</strong>
                </li>
                <li>
                  Toggle <strong>Custom SMTP</strong> to enabled
                </li>
                <li>
                  Enter your SMTP credentials:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Sender Name (e.g., "Snuff Specification Builder")</li>
                    <li>Sender Email (must match your SMTP provider's verified sender)</li>
                    <li>SMTP Host</li>
                    <li>SMTP Port</li>
                    <li>SMTP Username</li>
                    <li>SMTP Password</li>
                    <li>Enable TLS (recommended)</li>
                  </ul>
                </li>
                <li>
                  Click <strong>Save</strong>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">4. Test Your SMTP Configuration</h3>
              <p className="text-muted-foreground">
                After saving your SMTP settings, test the configuration by sending a test email through the Supabase
                dashboard or by testing the sign-in flow in your application.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Benefits of Custom SMTP</CardTitle>
            <CardDescription>Why setting up a custom SMTP server is important for production</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">No Rate Limits</h3>
                <p className="text-muted-foreground">
                  Remove the 2 emails per hour limit imposed by Supabase's default email service [^3].
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Better Deliverability</h3>
                <p className="text-muted-foreground">
                  Professional email services have better deliverability rates and are less likely to be marked as spam.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Custom Branding</h3>
                <p className="text-muted-foreground">
                  Remove the "powered by Supabase" footer and fully customize your email templates.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Analytics and Tracking</h3>
                <p className="text-muted-foreground">
                  Many email providers offer analytics on open rates, click rates, and delivery status.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Production Reliability</h3>
                <p className="text-muted-foreground">
                  Dedicated email services provide better uptime and reliability for production applications.
                </p>
              </div>
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
              <h3 className="font-medium">Emails not being sent</h3>
              <p className="text-muted-foreground">
                Check your SMTP credentials and make sure your sender email is verified with your SMTP provider. Some
                providers require domain verification or sender verification.
              </p>
            </div>

            <div>
              <h3 className="font-medium">Emails going to spam</h3>
              <p className="text-muted-foreground">
                Set up SPF, DKIM, and DMARC records for your domain to improve deliverability. Most email providers have
                guides on how to set these up.
              </p>
            </div>

            <div>
              <h3 className="font-medium">SMTP connection errors</h3>
              <p className="text-muted-foreground">
                Verify that your SMTP port (587 or 465) is not being blocked by your hosting provider or firewall. Some
                hosting providers block outgoing SMTP connections.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link href="/admin/auth-setup">
            <Button variant="outline" className="mr-4">
              Back to Auth Setup
            </Button>
          </Link>
          <Link href="https://supabase.com/docs/guides/auth/auth-smtp" target="_blank" rel="noopener noreferrer">
            <Button>Supabase SMTP Documentation</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

