-- Создаем расширение для генерации UUID, если оно еще не создано
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создаем таблицу categories, если она не существует
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу coloring_pages, если она не существует
CREATE TABLE IF NOT EXISTS coloring_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  image_url TEXT,
  thumbnail_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  difficulty_level TEXT DEFAULT 'medium',
  age_group TEXT DEFAULT 'all',
  is_featured BOOLEAN DEFAULT false,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу admin_users, если она не существует
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Добавляем администратора (замените на свой email)
INSERT INTO admin_users (email)
VALUES ('admin@example.com')
ON CONFLICT (email) DO NOTHING;

-- Проверяем, что таблицы созданы
SELECT 'categories' as table_name, COUNT(*) as row_count FROM categories
UNION ALL
SELECT 'coloring_pages' as table_name, COUNT(*) as row_count FROM coloring_pages
UNION ALL
SELECT 'admin_users' as table_name, COUNT(*) as row_count FROM admin_users;
