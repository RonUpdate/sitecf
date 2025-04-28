"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function fixAdminUsersRLS() {
  try {
    const supabase = createServerActionClient({ cookies })

    // Execute the SQL from our fix file
    const { error } = await supabase.rpc("execute_sql", {
      sql_string: `
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
      
      -- Create a security definer function to check if a user is a superadmin
      CREATE OR REPLACE FUNCTION public.is_superadmin(check_email TEXT)
      RETURNS BOOLEAN
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      BEGIN
          RETURN EXISTS (
              SELECT 1 FROM public.admin_users 
              WHERE email = check_email AND is_superadmin = true
          );
      END;
      $$;
      
      -- Grant execute permission on the function
      GRANT EXECUTE ON FUNCTION public.is_superadmin TO authenticated;
      GRANT EXECUTE ON FUNCTION public.is_superadmin TO anon;
      GRANT EXECUTE ON FUNCTION public.is_superadmin TO service_role;
      
      -- Create a policy for SELECT that uses the function instead of a direct query
      CREATE POLICY admin_users_select_policy ON public.admin_users
          FOR SELECT
          USING (
              -- Allow users to see their own record (if email matches)
              (auth.jwt() ->> 'email')::text = email
              -- Or allow access to all records for superadmins (using our function)
              OR public.is_superadmin((auth.jwt() ->> 'email')::text)
          );
      
      -- Create a policy for INSERT
      CREATE POLICY admin_users_insert_policy ON public.admin_users
          FOR INSERT
          WITH CHECK (
              -- Only superadmins can insert new admin users
              public.is_superadmin((auth.jwt() ->> 'email')::text)
          );
      
      -- Create a policy for UPDATE
      CREATE POLICY admin_users_update_policy ON public.admin_users
          FOR UPDATE
          USING (
              -- Users can update their own record
              (auth.jwt() ->> 'email')::text = email
              -- Or superadmins can update any record
              OR public.is_superadmin((auth.jwt() ->> 'email')::text)
          );
      
      -- Create a policy for DELETE
      CREATE POLICY admin_users_delete_policy ON public.admin_users
          FOR DELETE
          USING (
              -- Only superadmins can delete admin users
              public.is_superadmin((auth.jwt() ->> 'email')::text)
          );
      `,
    })

    if (error) {
      console.error("Error fixing RLS policies:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin")
    return { success: true }
  } catch (error: any) {
    console.error("Error in fixAdminUsersRLS:", error)
    return { success: false, error: error.message }
  }
}
