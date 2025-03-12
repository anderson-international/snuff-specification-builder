-- Create a new table for user profiles with roles
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile" 
ON user_profiles FOR SELECT 
USING (auth.uid() = id);

-- Allow admins to read all profiles
CREATE POLICY "Admins can read all profiles" 
ON user_profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow admins to insert new profiles
CREATE POLICY "Admins can insert profiles" 
ON user_profiles FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow admins to update profiles
CREATE POLICY "Admins can update profiles" 
ON user_profiles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow admins to delete profiles
CREATE POLICY "Admins can delete profiles" 
ON user_profiles FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create a function to create the first admin user
CREATE OR REPLACE FUNCTION create_first_admin(admin_email TEXT, admin_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_count INT;
  admin_id UUID;
BEGIN
  -- Check if there are any users
  SELECT COUNT(*) INTO user_count FROM auth.users;
  
  IF user_count = 0 THEN
    -- Create the admin user in auth.users
    INSERT INTO auth.users (email, email_confirmed_at, role)
    VALUES (admin_email, NOW(), 'authenticated')
    RETURNING id INTO admin_id;
    
    -- Create the admin profile
    INSERT INTO user_profiles (id, full_name, role)
    VALUES (admin_id, admin_name, 'admin');
    
    RETURN 'Admin user created successfully';
  ELSE
    RETURN 'Users already exist, cannot create first admin';
  END IF;
END;
$$;

