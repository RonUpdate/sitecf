-- Добавляем категории для блога
INSERT INTO blog_categories (name, slug) VALUES
('Вдохновение', 'inspiration'),
('Мастер-классы', 'tutorials'),
('Новости', 'news'),
('Советы начинающим', 'beginner-tips')
ON CONFLICT (slug) DO NOTHING;

-- Добавляем категории для раскрасок
INSERT INTO categories (name, slug, description) VALUES
('Животные', 'animals', 'Раскраски с изображениями различных животных'),
('Природа', 'nature', 'Раскраски с пейзажами и природными элементами'),
('Мандалы', 'mandalas', 'Сложные геометрические узоры для медитативного раскрашивания'),
('Для детей', 'for-kids', 'Простые и веселые раскраски для детей'),
('Праздники', 'holidays', 'Тематические раскраски к праздникам')
ON CONFLICT (slug) DO NOTHING;
