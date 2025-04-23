-- Функция для создания расширения, если оно не существует
CREATE OR REPLACE FUNCTION create_extension_if_not_exists(extension_name text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  EXECUTE format('CREATE EXTENSION IF NOT EXISTS %I', extension_name);
END;
$$;

-- Функция для создания таблицы categories
CREATE OR REPLACE FUNCTION create_categories_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$;

-- Функция для создания таблицы coloring_pages
CREATE OR REPLACE FUNCTION create_coloring_pages_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Создаем таблицу categories, если она еще не существует
  PERFORM create_categories_table();
  
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
END;
$$;

-- Функция для создания таблицы admin_users
CREATE OR REPLACE FUNCTION create_admin_users_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$;

-- Функция для добавления администратора
CREATE OR REPLACE FUNCTION add_admin_user(admin_email text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Создаем таблицу admin_users, если она еще не существует
  PERFORM create_admin_users_table();
  
  -- Добавляем администратора, если он еще не существует
  INSERT INTO admin_users (email)
  VALUES (admin_email)
  ON CONFLICT (email) DO NOTHING;
END;
$$;
