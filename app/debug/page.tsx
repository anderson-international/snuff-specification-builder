import { checkRequiredEnvVars } from "@/lib/env"
import DebugEnv from "@/components/debug-env"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  // Server-side check
  const { valid, missing } = checkRequiredEnvVars()

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Environment Debug</h1>

      {/* Client-side check */}
      <DebugEnv />

      {/* Server-side check results */}
      <Card>
        <CardHeader>
          <CardTitle>Server-Side Environment Check</CardTitle>
          <CardDescription>Checking environment variables on the server</CardDescription>
        </CardHeader>
        <CardContent>
          {valid ? (
            <div className="text-green-600 font-medium">
              ✅ All required environment variables are set on the server
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-red-600 font-medium">
                ❌ Some required environment variables are missing on the server
              </div>
              <div>
                <p>Missing variables:</p>
                <ul className="list-disc pl-5 mt-1">
                  {missing.map((variable) => (
                    <li key={variable}>{variable}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 space-y-4 text-sm">
        <h2 className="text-xl font-semibold">Troubleshooting Steps</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>Check Vercel Environment Variables:</strong>
            <p>Make sure all required variables are set in your Vercel project settings.</p>
          </li>
          <li>
            <strong>Verify Variable Names:</strong>
            <p>Environment variable names are case-sensitive. Ensure they match exactly.</p>
          </li>
          <li>
            <strong>Redeploy Your Application:</strong>
            <p>Sometimes changes to environment variables require a fresh deployment.</p>
          </li>
          <li>
            <strong>Check Environment Targets:</strong>
            <p>Ensure variables are set for the correct environment (Production, Preview, Development).</p>
          </li>
          <li>
            <strong>Restart Local Development:</strong>
            <p>If running locally, try stopping and restarting your development server.</p>
          </li>
        </ol>
      </div>
    </div>
  )
}

