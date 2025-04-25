-- Создаем расширение для генерации UUID, если оно еще не создано
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создаем таблицу admin_users, если она не существует
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Добавляем администратора (замените на свой email)
INSERT INTO admin_users (email)
VALUES ('sonyakern605@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Проверяем, что запись добавлена
SELECT * FROM admin_users;
