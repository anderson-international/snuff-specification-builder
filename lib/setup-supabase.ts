"use server"

import { createClient } from "@supabase/supabase-js"

// Create a function to get the Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables. Please check your .env file or environment configuration.")
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function setupSnuffSpecificationsTable() {
  try {
    const supabase = getSupabaseClient()

    // Check if the table exists
    const { error: checkError } = await supabase.from("snuff_specifications").select("id").limit(1)

    // If there's no error, the table exists
    if (!checkError) {
      return { success: true, message: "Table already exists" }
    }

    // If we get an error that's not about the table not existing, it's a real error
    if (checkError && !checkError.message.includes("does not exist")) {
      throw checkError
    }

    // Create the table directly with SQL
    const createTableSQL = `
      CREATE TABLE snuff_specifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id BIGINT NOT NULL,
        product_title TEXT NOT NULL,
        ease_of_use TEXT NOT NULL,
        nicotine_content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Create indexes
      CREATE INDEX idx_snuff_specifications_product_id ON snuff_specifications(product_id);
      
      -- Set up RLS (Row Level Security)
      ALTER TABLE snuff_specifications ENABLE ROW LEVEL SECURITY;
      
      -- Create policies
      CREATE POLICY "Allow anonymous read access" 
        ON snuff_specifications FOR SELECT 
        USING (true);
        
      CREATE POLICY "Allow authenticated insert" 
        ON snuff_specifications FOR INSERT 
        WITH CHECK (true);
    `

    const { error: createError } = await supabase.rpc("exec_sql", { sql: createTableSQL })

    if (createError) {
      // If the exec_sql RPC doesn't exist, we need to create it first
      if (createError.message.includes("function exec_sql") || createError.message.includes("does not exist")) {
        // Try creating the table without RPC
        const { error: directError } = await supabase.sql(createTableSQL)

        if (directError) {
          throw new Error(`Failed to create table: ${directError.message}`)
        }

        return { success: true, message: "Table created successfully" }
      }

      throw createError
    }

    return { success: true, message: "Table created successfully" }
  } catch (error) {
    console.error("Error setting up Supabase table:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

