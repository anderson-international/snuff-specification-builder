import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import UserManagement from "@/components/admin/user-management"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch all users with their profiles
  const { data: users, error } = await supabase
    .from("user_profiles")
    .select(`
      id,
      full_name,
      role,
      created_at,
      auth_users:id(email)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
  }

  // Transform the data to match our UserWithProfile type
  const transformedUsers =
    users?.map((user) => ({
      id: user.id,
      email: user.auth_users?.email || "",
      full_name: user.full_name,
      role: user.role,
      created_at: user.created_at,
    })) || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>View and manage user accounts and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <UserManagement initialUsers={transformedUsers} />
      </CardContent>
    </Card>
  )
}

