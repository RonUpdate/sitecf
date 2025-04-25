-- Проверяем существующие RLS политики для таблицы products
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'products';

-- Включаем RLS для таблицы products, если она еще не включена
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Создаем политику для разрешения всех операций для аутентифицированных пользователей
-- Сначала удаляем существующую политику, если она есть
DROP POLICY IF EXISTS products_admin_policy ON public.products;

-- Создаем новую политику, разрешающую все операции для администраторов
CREATE POLICY products_admin_policy ON public.products
    USING (
        -- Проверяем, является ли пользователь администратором
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE email = auth.jwt() ->> 'email'
        )
    )
    WITH CHECK (
        -- Та же проверка для операций вставки и обновления
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE email = auth.jwt() ->> 'email'
        )
    );

-- Создаем политику для чтения для всех пользователей
DROP POLICY IF EXISTS products_select_policy ON public.products;
CREATE POLICY products_select_policy ON public.products
    FOR SELECT
    USING (true);

-- Проверяем, что политики созданы
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'products';
