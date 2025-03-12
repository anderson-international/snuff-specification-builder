export interface UserProfile {
  id: string
  full_name: string
  role: "admin" | "user"
  created_at?: string
  updated_at?: string
}

export interface UserWithProfile {
  id: string
  email: string
  full_name: string
  role: "admin" | "user"
  created_at?: string
}

