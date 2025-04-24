-- Исправление функции is_superadmin с установкой явного search_path
CREATE OR REPLACE FUNCTION public.is_superadmin(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE email = user_email
  );
END;
$$;

-- Добавление комментария к функции
COMMENT ON FUNCTION public.is_superadmin(TEXT) IS 'Проверяет, является ли пользователь с указанным email суперадминистратором';

-- Установка правильных разрешений
REVOKE ALL ON FUNCTION public.is_superadmin(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_superadmin(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_superadmin(TEXT) TO service_role;
