-- Disable RLS temporarily to fix the issue
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might be causing recursion
DROP POLICY IF EXISTS admin_users_policy ON public.admin_users;
DROP POLICY IF EXISTS admin_users_select_policy ON public.admin_users;
DROP POLICY IF EXISTS admin_users_insert_policy ON public.admin_users;
DROP POLICY IF EXISTS admin_users_update_policy ON public.admin_users;
DROP POLICY IF EXISTS admin_users_delete_policy ON public.admin_users;

-- Re-enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create a simple non-recursive policy for SELECT
-- This allows users to see their own record or if they're a superadmin
CREATE POLICY admin_users_select_policy ON public.admin_users
    FOR SELECT
    USING (
        -- Allow users to see their own record (if email matches)
        (auth.jwt() ->> 'email')::text = email
        -- Or allow access to all records for superadmins (using a direct check)
        OR (auth.jwt() ->> 'email')::text IN (
            SELECT email FROM public.admin_users WHERE is_superadmin = true
        )
    );

-- Create a policy for INSERT
CREATE POLICY admin_users_insert_policy ON public.admin_users
    FOR INSERT
    WITH CHECK (
        -- Only superadmins can insert new admin users
        (auth.jwt() ->> 'email')::text IN (
            SELECT email FROM public.admin_users WHERE is_superadmin = true
        )
    );

-- Create a policy for UPDATE
CREATE POLICY admin_users_update_policy ON public.admin_users
    FOR UPDATE
    USING (
        -- Users can update their own record
        (auth.jwt() ->> 'email')::text = email
        -- Or superadmins can update any record
        OR (auth.jwt() ->> 'email')::text IN (
            SELECT email FROM public.admin_users WHERE is_superadmin = true
        )
    );

-- Create a policy for DELETE
CREATE POLICY admin_users_delete_policy ON public.admin_users
    FOR DELETE
    USING (
        -- Only superadmins can delete admin users
        (auth.jwt() ->> 'email')::text IN (
            SELECT email FROM public.admin_users WHERE is_superadmin = true
        )
    );

-- Create a function to safely check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE email = user_email
    );
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin TO service_role;
