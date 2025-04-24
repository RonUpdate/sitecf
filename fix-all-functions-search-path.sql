-- Функция для исправления всех функций с мутабельным search_path
CREATE OR REPLACE FUNCTION public.fix_all_functions_search_path()
RETURNS TABLE(schema_name text, function_name text, fixed boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  func_record RECORD;
  func_def TEXT;
  new_func_def TEXT;
BEGIN
  FOR func_record IN
    SELECT 
      n.nspname AS schema_name,
      p.proname AS function_name,
      p.oid AS func_oid,
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
      )
  LOOP
    schema_name := func_record.schema_name;
    function_name := func_record.function_name;
    
    -- Получаем определение функции
    func_def := func_record.function_definition;
    
    -- Проверяем, содержит ли определение SECURITY DEFINER
    IF func_def NOT LIKE '%SECURITY DEFINER%' THEN
      -- Добавляем SECURITY DEFINER и SET search_path
      new_func_def := regexp_replace(
        func_def,
        'LANGUAGE ([a-zA-Z0-9_]+)(\s*AS)',
        'LANGUAGE \1 SECURITY DEFINER SET search_path = ' || schema_name || '\2',
        'i'
      );
      
      -- Выполняем новое определение функции
      BEGIN
        EXECUTE new_func_def;
        fixed := TRUE;
      EXCEPTION WHEN OTHERS THEN
        fixed := FALSE;
      END;
    ELSE
      -- Добавляем только SET search_path
      new_func_def := regexp_replace(
        func_def,
        'SECURITY DEFINER(\s*AS)',
        'SECURITY DEFINER SET search_path = ' || schema_name || '\1',
        'i'
      );
      
      -- Выполняем новое определение функции
      BEGIN
        EXECUTE new_func_def;
        fixed := TRUE;
      EXCEPTION WHEN OTHERS THEN
        fixed := FALSE;
      END;
    END IF;
    
    RETURN NEXT;
  END LOOP;
END;
$$;

-- Комментарий к функции
COMMENT ON FUNCTION public.fix_all_functions_search_path() IS 'Исправляет все функции с мутабельным search_path, добавляя SET search_path и SECURITY DEFINER при необходимости';
