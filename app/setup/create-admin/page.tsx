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
import { createFirstAdmin } from "@/lib/admin-actions"

export default function CreateAdminPage() {
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createFirstAdmin({
        email,
        full_name: fullName,
      })

      if (result.success) {
        toast({
          title: "Admin user created",
          description: "You can now sign in with the provided email.",
        })

        router.push("/auth/signin")
      } else {
        toast({
          title: "Failed to create admin",
          description: result.error || "An unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating admin:", error)
      toast({
        title: "Failed to create admin",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Create First Admin User</h1>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Initial Setup</CardTitle>
          <CardDescription>Create the first administrator account for your application.</CardDescription>
        </CardHeader>
        <form onSubmit={handleCreateAdmin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Admin User"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Admin User
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

