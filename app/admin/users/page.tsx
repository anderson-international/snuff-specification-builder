import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import UserManagement from "@/components/admin/user-management"
import { isAdmin } from "@/lib/auth-utils"

export default async function AdminUsersPage() {
  const supabase = createServerComponentClient({ cookies })

  // Check if user is authenticated and is an admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  // Check if user is an admin
  const isUserAdmin = await isAdmin(user.id)

  if (!isUserAdmin) {
    redirect("/")
  }

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
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      <UserManagement initialUsers={transformedUsers} />
    </div>
  )
}

