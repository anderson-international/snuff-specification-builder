"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

type AuthMode = "signin" | "signup"

export default function AuthForm({ initialMode = "signin" }: { initialMode?: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        })

        router.push("/")
        router.refresh()
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) throw error

        toast({
          title: "Sign up successful",
          description: "Please check your email to confirm your account.",
        })
      }
    } catch (error) {
      console.error("Authentication error:", error)
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{mode === "signin" ? "Sign In" : "Sign Up"}</CardTitle>
        <CardDescription>
          {mode === "signin" ? "Enter your credentials to access your account" : "Create a new account to get started"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleAuth}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </Button>
          <p className="text-center text-sm">
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="text-primary underline"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            >
              {mode === "signin" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}

