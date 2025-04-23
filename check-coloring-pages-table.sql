-- Проверяем существование таблицы coloring_pages
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'coloring_pages'
);

-- Если таблица не существует, создаем ее
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

-- Проверяем, есть ли записи в таблице
SELECT COUNT(*) FROM coloring_pages;
