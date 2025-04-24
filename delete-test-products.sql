-- Удаление всех продуктов из базы данных
DELETE FROM products;

-- Сброс последовательности ID (если используется)
ALTER SEQUENCE products_id_seq RESTART WITH 1;
