-- Создаем функцию для выполнения произвольного SQL (только для администраторов)
CREATE OR REPLACE FUNCTION public.execute_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Проверяем, является ли пользователь администратором
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Только администраторы могут выполнять произвольный SQL';
  END IF;
  
  -- Выполняем SQL-запрос
  EXECUTE sql_query;
END;
$$;

-- Устанавливаем права доступа к функции
ALTER FUNCTION public.execute_sql(text) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.execute_sql(text) TO authenticated;
