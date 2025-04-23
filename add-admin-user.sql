-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add an admin user (replace with your email)
INSERT INTO admin_users (email)
VALUES ('admin@example.com')
ON CONFLICT (email) DO NOTHING;
