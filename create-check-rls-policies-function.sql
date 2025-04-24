-- Создаем функцию для проверки политик RLS для таблицы
CREATE OR REPLACE FUNCTION public.check_rls_policies(table_name text)
RETURNS TABLE(policyname text, tablename text, cmd text, qual text, with_check text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.policyname::text,
    p.tablename::text,
    p.cmd::text,
    p.qual::text,
    p.with_check::text
  FROM 
    pg_policies p
  WHERE 
    p.tablename = table_name;
END;
$$;

-- Устанавливаем права доступа к функции
ALTER FUNCTION public.check_rls_policies(text) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.check_rls_policies(text) TO public;
GRANT EXECUTE ON FUNCTION public.check_rls_policies(text) TO anon;
GRANT EXECUTE ON FUNCTION public.check_rls_policies(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_rls_policies(text) TO service_role;
