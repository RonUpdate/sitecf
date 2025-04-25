-- Добавляем колонку is_featured в таблицу products, если она отсутствует
DO $$ 
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'products'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE public.products ADD COLUMN is_featured BOOLEAN DEFAULT false;
    COMMENT ON COLUMN public.products.is_featured IS 'Флаг для отображения товара в рекомендуемых';
  END IF;
END $$;

-- Проверяем, что колонка добавлена успешно
SELECT column_name, data_type, column_default, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'products' 
AND column_name = 'is_featured';
