-- Создаем функцию, которая будет проверять, нужно ли добавлять тестовые данные
CREATE OR REPLACE FUNCTION public.should_add_sample_data()
RETURNS boolean AS $$
BEGIN
  -- Всегда возвращаем false, чтобы предотвратить автоматическое добавление тестовых данных
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Добавляем комментарий к функции
COMMENT ON FUNCTION public.should_add_sample_data() IS 'Функция, которая определяет, нужно ли добавлять тестовые данные. Всегда возвращает false.';

-- Создаем таблицу для хранения настроек, если она еще не существует
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Добавляем настройку для отключения автоматического добавления тестовых данных
INSERT INTO public.app_settings (key, value)
VALUES ('disable_auto_sample_data', 'true'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = 'true'::jsonb, updated_at = now();
