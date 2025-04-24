-- Вариант 1: Отключить RLS для таблицы blog_tags
ALTER TABLE public.blog_tags DISABLE ROW LEVEL SECURITY;

-- Вариант 2: Создать политику доступа для всех пользователей
-- ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS blog_tags_all_access ON public.blog_tags;
-- CREATE POLICY blog_tags_all_access ON public.blog_tags
--   USING (true)
--   WITH CHECK (true);

-- Вариант 3: Создать политику доступа только для администраторов
-- ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS blog_tags_admin_access ON public.blog_tags;
-- CREATE POLICY blog_tags_admin_access ON public.blog_tags
--   USING (is_admin(auth.uid()))
--   WITH CHECK (is_admin(auth.uid()));
