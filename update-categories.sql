-- Удаляем все существующие категории
DELETE FROM categories;

-- Добавляем 5 новых категорий для раскрасок из "Креатив Фабрика"
INSERT INTO categories (name, slug, description) VALUES
('Животные', 'animals', 'Раскраски с изображениями различных животных от Креатив Фабрика'),
('Природа', 'nature', 'Раскраски с пейзажами и природными элементами от Креатив Фабрика'),
('Мандалы', 'mandalas', 'Сложные геометрические узоры для медитативного раскрашивания от Креатив Фабрика'),
('Для детей', 'for-kids', 'Простые и веселые раскраски для детей от Креатив Фабрика'),
('Праздники', 'holidays', 'Тематические раскраски к праздникам от Креатив Фабрика');
