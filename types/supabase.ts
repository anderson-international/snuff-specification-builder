export interface SnuffSpecification {
  id?: string
  product_id: number
  product_title: string
  ease_of_use: "Beginner" | "Intermediate" | "Experienced"
  nicotine_content: "None" | "Low" | "Medium" | "High"
  user_id?: string
  created_at?: string
  updated_at?: string
}

