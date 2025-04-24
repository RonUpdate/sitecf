-- Обновление функции для добавления администратора
CREATE OR REPLACE FUNCTION public.add_admin_user(admin_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Создаем таблицу admin_users, если она еще не существует
  PERFORM create_admin_users_table();
  
  -- Добавляем администратора, если он еще не существует
  INSERT INTO public.admin_users (email)
  VALUES (admin_email)
  ON CONFLICT (email) DO NOTHING;
END;
$$;

-- Обновление функции для создания таблицы администраторов
CREATE OR REPLACE FUNCTION public.create_admin_users_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$;

-- Обновление функции для проверки существования таблицы
CREATE OR REPLACE FUNCTION public.check_table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = $1
  );
END;
$$;
