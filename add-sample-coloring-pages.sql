-- Получаем ID категорий
WITH categories_ids AS (
  SELECT id, slug FROM categories
)

-- Добавляем тестовые раскраски для каждой категории
INSERT INTO coloring_pages (title, slug, description, price, difficulty_level, age_group, is_featured, category_id, image_url)
SELECT
  CASE 
    WHEN c.slug = 'animals' THEN 'Лесные животные'
    WHEN c.slug = 'nature' THEN 'Горный пейзаж'
    WHEN c.slug = 'mandalas' THEN 'Цветочная мандала'
    WHEN c.slug = 'for-kids' THEN 'Веселые динозавры'
    WHEN c.slug = 'holidays' THEN 'Новогодняя елка'
  END as title,
  
  CASE 
    WHEN c.slug = 'animals' THEN 'forest-animals'
    WHEN c.slug = 'nature' THEN 'mountain-landscape'
    WHEN c.slug = 'mandalas' THEN 'flower-mandala'
    WHEN c.slug = 'for-kids' THEN 'fun-dinosaurs'
    WHEN c.slug = 'holidays' THEN 'christmas-tree'
  END as slug,
  
  CASE 
    WHEN c.slug = 'animals' THEN 'Раскраска с изображениями лесных животных от Креатив Фабрика'
    WHEN c.slug = 'nature' THEN 'Красивый горный пейзаж для раскрашивания от Креатив Фабрика'
    WHEN c.slug = 'mandalas' THEN 'Сложная цветочная мандала для медитативного раскрашивания от Креатив Фабрика'
    WHEN c.slug = 'for-kids' THEN 'Веселые динозавры для детского творчества от Креатив Фабрика'
    WHEN c.slug = 'holidays' THEN 'Праздничная новогодняя елка для раскрашивания от Креатив Фабрика'
  END as description,
  
  CASE 
    WHEN c.slug = 'animals' THEN 3.99
    WHEN c.slug = 'nature' THEN 4.99
    WHEN c.slug = 'mandalas' THEN 5.99
    WHEN c.slug = 'for-kids' THEN 2.99
    WHEN c.slug = 'holidays' THEN 3.99
  END as price,
  
  CASE 
    WHEN c.slug = 'animals' THEN 'medium'
    WHEN c.slug = 'nature' THEN 'hard'
    WHEN c.slug = 'mandalas' THEN 'hard'
    WHEN c.slug = 'for-kids' THEN 'easy'
    WHEN c.slug = 'holidays' THEN 'medium'
  END as difficulty_level,
  
  CASE 
    WHEN c.slug = 'animals' THEN 'all'
    WHEN c.slug = 'nature' THEN 'adults'
    WHEN c.slug = 'mandalas' THEN 'adults'
    WHEN c.slug = 'for-kids' THEN 'children'
    WHEN c.slug = 'holidays' THEN 'all'
  END as age_group,
  
  true as is_featured,
  c.id as category_id,
  
  CASE 
    WHEN c.slug = 'animals' THEN '/placeholder.svg?height=400&width=400&query=forest+animals+coloring+page'
    WHEN c.slug = 'nature' THEN '/placeholder.svg?height=400&width=400&query=mountain+landscape+coloring+page'
    WHEN c.slug = 'mandalas' THEN '/placeholder.svg?height=400&width=400&query=flower+mandala+coloring+page'
    WHEN c.slug = 'for-kids' THEN '/placeholder.svg?height=400&width=400&query=dinosaurs+coloring+page+for+kids'
    WHEN c.slug = 'holidays' THEN '/placeholder.svg?height=400&width=400&query=christmas+tree+coloring+page'
  END as image_url
  
FROM categories_ids c;
