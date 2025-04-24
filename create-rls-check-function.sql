-- Создаем таблицу для хранения результатов проверок RLS
CREATE TABLE IF NOT EXISTS public.rls_check_results (
  id SERIAL PRIMARY KEY,
  check_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tablename TEXT NOT NULL,
  has_rls BOOLEAN NOT NULL,
  has_policies BOOLEAN NOT NULL,
  policies_count INTEGER NOT NULL,
  status TEXT NOT NULL,
  details JSONB
);

-- Добавляем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_rls_check_results_check_time ON public.rls_check_results(check_time);
CREATE INDEX IF NOT EXISTS idx_rls_check_results_tablename ON public.rls_check_results(tablename);
CREATE INDEX IF NOT EXISTS idx_rls_check_results_status ON public.rls_check_results(status);

-- Создаем функцию для проверки RLS всех таблиц
CREATE OR REPLACE FUNCTION public.check_all_tables_rls()
RETURNS TABLE(
  tablename TEXT,
  has_rls BOOLEAN,
  has_policies BOOLEAN,
  policies_count INTEGER,
  status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  table_record RECORD;
  policy_count INTEGER;
  check_status TEXT;
  check_details JSONB;
BEGIN
  -- Очищаем временную таблицу для результатов текущей проверки
  CREATE TEMP TABLE IF NOT EXISTS temp_rls_results (
    tablename TEXT,
    has_rls BOOLEAN,
    has_policies BOOLEAN,
    policies_count INTEGER,
    status TEXT,
    details JSONB
  ) ON COMMIT DROP;
  
  DELETE FROM temp_rls_results;
  
  -- Проверяем каждую таблицу в схеме public
  FOR table_record IN 
    SELECT t.tablename, t.rowsecurity
    FROM pg_tables t
    WHERE t.schemaname = 'public'
  LOOP
    -- Получаем количество политик для таблицы
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies p
    WHERE p.tablename = table_record.tablename AND p.schemaname = 'public';
    
    -- Определяем статус
    IF table_record.rowsecurity AND policy_count = 0 THEN
      check_status := 'error';
      check_details := json_build_object(
        'message', 'RLS включен, но политики отсутствуют',
        'recommendation', 'Добавьте политики RLS или отключите RLS для этой таблицы'
      );
    ELSIF table_record.rowsecurity THEN
      check_status := 'ok';
      check_details := json_build_object(
        'message', 'RLS настроен корректно',
        'policies', policy_count
      );
    ELSE
      check_status := 'info';
      check_details := json_build_object(
        'message', 'RLS отключен для этой таблицы',
        'recommendation', 'Рассмотрите возможность включения RLS для повышения безопасности'
      );
    END IF;
    
    -- Сохраняем результат во временной таблице
    INSERT INTO temp_rls_results (
      tablename, 
      has_rls, 
      has_policies, 
      policies_count, 
      status, 
      details
    )
    VALUES (
      table_record.tablename,
      table_record.rowsecurity,
      policy_count > 0,
      policy_count,
      check_status,
      check_details
    );
    
    -- Сохраняем результат в постоянной таблице
    INSERT INTO public.rls_check_results (
      tablename, 
      has_rls, 
      has_policies, 
      policies_count, 
      status, 
      details
    )
    VALUES (
      table_record.tablename,
      table_record.rowsecurity,
      policy_count > 0,
      policy_count,
      check_status,
      check_details
    );
  END LOOP;
  
  -- Возвращаем результаты
  RETURN QUERY
  SELECT 
    tr.tablename,
    tr.has_rls,
    tr.has_policies,
    tr.policies_count,
    tr.status
  FROM 
    temp_rls_results tr
  ORDER BY 
    CASE tr.status 
      WHEN 'error' THEN 1 
      WHEN 'warning' THEN 2 
      WHEN 'info' THEN 3 
      ELSE 4 
    END,
    tr.tablename;
END;
$$;

-- Устанавливаем права доступа к функции
ALTER FUNCTION public.check_all_tables_rls() OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.check_all_tables_rls() TO service_role;

-- Создаем функцию для получения последних результатов проверки
CREATE OR REPLACE FUNCTION public.get_latest_rls_check_results()
RETURNS TABLE(
  tablename TEXT,
  has_rls BOOLEAN,
  has_policies BOOLEAN,
  policies_count INTEGER,
  status TEXT,
  details JSONB,
  check_time TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH latest_checks AS (
    SELECT 
      tablename,
      MAX(check_time) as latest_check_time
    FROM 
      public.rls_check_results
    GROUP BY 
      tablename
  )
  SELECT 
    r.tablename,
    r.has_rls,
    r.has_policies,
    r.policies_count,
    r.status,
    r.details,
    r.check_time
  FROM 
    public.rls_check_results r
  JOIN 
    latest_checks lc ON r.tablename = lc.tablename AND r.check_time = lc.latest_check_time
  ORDER BY 
    CASE r.status 
      WHEN 'error' THEN 1 
      WHEN 'warning' THEN 2 
      WHEN 'info' THEN 3 
      ELSE 4 
    END,
    r.tablename;
END;
$$;

-- Устанавливаем права доступа к функции
ALTER FUNCTION public.get_latest_rls_check_results() OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.get_latest_rls_check_results() TO service_role;
