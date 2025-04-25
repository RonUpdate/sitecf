-- Проверяем существование таблицы products
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
    -- Создаем таблицу products, если она не существует
    CREATE TABLE products (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) DEFAULT 0,
      stock_quantity INTEGER DEFAULT 0,
      category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
      slug TEXT UNIQUE,
      is_featured BOOLEAN DEFAULT false,
      image_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Добавляем RLS политики
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
    
    -- Политика для админов - полный доступ
    CREATE POLICY admin_all ON products
      USING (auth.jwt() ->> 'role' = 'admin')
      WITH CHECK (auth.jwt() ->> 'role' = 'admin');
      
    -- Политика для чтения всем
    CREATE POLICY select_all ON products
      FOR SELECT USING (true);
      
  ELSE
    -- Если таблица существует, проверяем наличие колонки image_url
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'products' 
      AND column_name = 'image_url'
    ) THEN
      -- Добавляем колонку image_url, если она отсутствует
      ALTER TABLE products ADD COLUMN image_url TEXT;
    END IF;
  END IF;
END $$;

-- Проверяем наличие расширения uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
