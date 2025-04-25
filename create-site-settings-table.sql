-- Создаем таблицу site_settings, если она не существует
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включаем RLS для таблицы site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Удаляем существующие политики, если они есть
DROP POLICY IF EXISTS site_settings_admin_policy ON public.site_settings;
DROP POLICY IF EXISTS site_settings_select_policy ON public.site_settings;

-- Создаем политику для разрешения всех операций для администраторов
CREATE POLICY site_settings_admin_policy ON public.site_settings
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Создаем политику для чтения для всех пользователей
CREATE POLICY site_settings_select_policy ON public.site_settings
    FOR SELECT
    USING (true);

-- Добавляем или обновляем настройку favicon_url
INSERT INTO public.site_settings (key, value, updated_at)
VALUES ('favicon_url', 'https://uenczyfmsqiafcjrlial.supabase.co/storage/v1/object/public/favicons//watercolor-sun-transparent.ico', NOW())
ON CONFLICT (key) 
DO UPDATE SET value = 'https://uenczyfmsqiafcjrlial.supabase.co/storage/v1/object/public/favicons//watercolor-sun-transparent.ico', updated_at = NOW();

-- Проверяем, что настройки созданы
SELECT * FROM public.site_settings;
