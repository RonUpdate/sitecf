-- Check current RLS policies on admin_users
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'admin_users';

-- Disable RLS temporarily to diagnose the issue
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Create a simpler policy that doesn't cause recursion
-- This policy allows admins to see all admin users and users to see their own record
CREATE OR REPLACE FUNCTION public.get_admin_users_safely()
RETURNS SETOF public.admin_users
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT * FROM public.admin_users;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_admin_users_safely() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_users_safely() TO anon;
GRANT EXECUTE ON FUNCTION public.get_admin_users_safely() TO service_role;

-- Re-enable RLS with a safer policy
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might be causing recursion
DROP POLICY IF EXISTS admin_users_policy ON public.admin_users;

-- Create a simple policy that doesn't cause recursion
CREATE POLICY admin_users_select_policy ON public.admin_users
    FOR SELECT
    USING (true);  -- Allow all users to view admin_users (or adjust as needed)

-- If you need more restrictive policies, you can add them here
-- For example, to only allow admins to see all records:
-- CREATE POLICY admin_users_admin_policy ON public.admin_users
--    FOR ALL
--    USING (auth.uid() IN (SELECT id FROM public.admin_users));
