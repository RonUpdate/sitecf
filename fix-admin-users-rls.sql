-- IMPORTANT: Run this SQL in your Supabase SQL Editor to fix the infinite recursion issue

-- Step 1: Temporarily disable RLS on the admin_users table
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies that might be causing recursion
DROP POLICY IF EXISTS admin_users_policy ON public.admin_users;
DROP POLICY IF EXISTS admin_users_select_policy ON public.admin_users;
DROP POLICY IF EXISTS admin_users_insert_policy ON public.admin_users;
DROP POLICY IF EXISTS admin_users_update_policy ON public.admin_users;
DROP POLICY IF EXISTS admin_users_delete_policy ON public.admin_users;

-- Step 3: Create a simple policy that doesn't cause recursion
-- This policy allows authenticated users to see all admin users
-- You can refine this later based on your security requirements
CREATE POLICY admin_users_select_policy ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (true);

-- Step 4: Re-enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
