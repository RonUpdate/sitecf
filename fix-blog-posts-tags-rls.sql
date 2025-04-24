-- Вариант 1: Отключить RLS для таблицы blog_posts_tags
ALTER TABLE public.blog_posts_tags DISABLE ROW LEVEL SECURITY;

-- Вариант 2: Создать политику RLS, разрешающую доступ для всех пользователей
-- ALTER TABLE public.blog_posts_tags ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY blog_posts_tags_all_access ON public.blog_posts_tags
--    USING (true)
--    WITH CHECK (true);

-- Вариант 3: Создать политику RLS, разрешающую доступ только для администраторов
-- ALTER TABLE public.blog_posts_tags ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY blog_posts_tags_admin_access ON public.blog_posts_tags
--    USING (is_admin(auth.uid()))
--    WITH CHECK (is_admin(auth.uid()));

-- Проверка текущего состояния RLS для таблицы
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'blog_posts_tags';

-- Проверка существующих политик RLS для таблицы
SELECT * 
FROM pg_policies 
WHERE tablename = 'blog_posts_tags';
