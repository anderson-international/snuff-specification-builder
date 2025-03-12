-- Add user_id column to snuff_specifications table
ALTER TABLE snuff_specifications 
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Update RLS policies to be user-based
DROP POLICY IF EXISTS "Allow anonymous read access" ON snuff_specifications;
DROP POLICY IF EXISTS "Allow authenticated insert" ON snuff_specifications;

-- Anyone can read specifications
CREATE POLICY "Anyone can read specifications" 
ON snuff_specifications FOR SELECT 
USING (true);

-- Authenticated users can insert their own specifications
CREATE POLICY "Users can insert their own specifications" 
ON snuff_specifications FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own specifications
CREATE POLICY "Users can update their own specifications" 
ON snuff_specifications FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own specifications
CREATE POLICY "Users can delete their own specifications" 
ON snuff_specifications FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

