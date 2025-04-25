-- Create site_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Allow admins to read site_settings" ON site_settings;
DROP POLICY IF EXISTS "Allow admins to insert site_settings" ON site_settings;
DROP POLICY IF EXISTS "Allow admins to update site_settings" ON site_settings;
DROP POLICY IF EXISTS "Allow admins to delete site_settings" ON site_settings;

-- Enable RLS on the table
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Allow admins to read site_settings" 
ON site_settings FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Allow admins to insert site_settings" 
ON site_settings FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Allow admins to update site_settings" 
ON site_settings FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Allow admins to delete site_settings" 
ON site_settings FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.email = auth.jwt() ->> 'email'
  )
);

-- Insert some default settings if they don't exist
INSERT INTO site_settings (key, value)
VALUES 
  ('site_name', 'Coloring Pages Site'),
  ('site_description', 'A beautiful collection of coloring pages for all ages')
ON CONFLICT (key) DO NOTHING;
