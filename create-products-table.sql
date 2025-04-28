-- Проверяем существует ли таблица products
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
        -- Создаем таблицу products если она не существует
        CREATE TABLE products (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            image_url TEXT,
            category_id UUID REFERENCES categories(id),
            slug TEXT UNIQUE NOT NULL,
            stock_quantity INTEGER DEFAULT 0,
            is_featured BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Добавляем RLS политики
        ALTER TABLE products ENABLE ROW LEVEL SECURITY;

        -- Политика для чтения (все могут читать)
        CREATE POLICY "Allow public read access" ON products
            FOR SELECT USING (true);

        -- Политика для вставки (только аутентифицированные пользователи)
        CREATE POLICY "Allow authenticated insert" ON products
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');

        -- Политика для обновления (только аутентифицированные пользователи)
        CREATE POLICY "Allow authenticated update" ON products
            FOR UPDATE USING (auth.role() = 'authenticated');

        -- Политика для удаления (только аутентифицированные пользователи)
        CREATE POLICY "Allow authenticated delete" ON products
            FOR DELETE USING (auth.role() = 'authenticated');

        -- Создаем триггер для обновления updated_at
        CREATE OR REPLACE FUNCTION update_modified_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER update_products_modtime
            BEFORE UPDATE ON products
            FOR EACH ROW
            EXECUTE FUNCTION update_modified_column();
    END IF;
END
$$;
