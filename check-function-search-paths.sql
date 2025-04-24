-- Проверка функций на наличие мутабельного search_path
SELECT 
  n.nspname AS schema_name,
  p.proname AS function_name,
  pg_get_functiondef(p.oid) AS function_definition
FROM 
  pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE 
  n.nspname NOT IN ('pg_catalog', 'information_schema')
  AND NOT EXISTS (
    SELECT 1 
    FROM pg_proc_info pi 
    WHERE pi.oid = p.oid 
      AND pi.proconfig::text LIKE '%search_path=%'
  );
