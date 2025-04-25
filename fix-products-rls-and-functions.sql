-- 1. Включаем RLS для таблицы products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 2. Удаляем существующие политики, если они есть
DROP POLICY IF EXISTS products_admin_policy ON public.products;
DROP POLICY IF EXISTS products_select_policy ON public.products;

-- 3. Создаем функцию для проверки, является ли пользователь администратором
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_email TEXT;
    is_admin_user BOOLEAN;
BEGIN
    -- Получаем email текущего пользователя из JWT токена
    user_email := auth.jwt() ->> 'email';
    
    -- Проверяем, существует ли пользователь в таблице admin_users
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE email = user_email
    ) INTO is_admin_user;
    
    -- Возвращаем результат проверки
    RETURN is_admin_user;
END;
$$;

-- 4. Создаем политику для разрешения всех операций для администраторов
CREATE POLICY products_admin_policy ON public.products
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 5. Создаем политику для чтения для всех пользователей
CREATE POLICY products_select_policy ON public.products
    FOR SELECT
    USING (true);

-- 6. Исправляем функцию get_product_by_id
DROP FUNCTION IF EXISTS public.get_product_by_id(UUID);

CREATE OR REPLACE FUNCTION public.get_product_by_id(product_id uuid)
RETURNS TABLE(
    id uuid, 
    name text, 
    description text, 
    price numeric, 
    image_url text, 
    thumbnail_url text, 
    category_id uuid, 
    slug text, 
    is_featured boolean,
    featured boolean,
    stock_quantity integer,
    created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.name, p.description, p.price, p.image_url, p.thumbnail_url, 
         p.category_id, p.slug, p.is_featured, p.featured, p.stock_quantity, p.created_at
  FROM products p
  WHERE p.id = product_id;
  
  RETURN;
END;
$$;
