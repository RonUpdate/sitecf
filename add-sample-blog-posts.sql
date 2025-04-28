-- Add sample blog posts
INSERT INTO blog_posts (
  id, 
  title, 
  slug, 
  content, 
  excerpt, 
  featured_image, 
  published, 
  published_at, 
  created_at, 
  updated_at,
  author
)
VALUES
  (
    gen_random_uuid(),
    'Как раскраски помогают снять стресс',
    'how-coloring-reduces-stress',
    'Раскрашивание — это не просто детское развлечение. Многочисленные исследования показывают, что раскраски для взрослых могут значительно снизить уровень стресса и тревоги.',
    'Узнайте, как простое раскрашивание может стать эффективным инструментом для снижения стресса и улучшения психологического благополучия.',
    '/placeholder.svg?height=600&width=1200&query=coloring+pages+for+adults',
    true,
    NOW() - interval '5 days',
    NOW() - interval '10 days',
    NOW() - interval '2 days',
    'Администратор'
  ),
  (
    gen_random_uuid(),
    'Лучшие техники раскрашивания для начинающих',
    'best-coloring-techniques-for-beginners',
    'Если вы только начинаете свой путь в мире раскрашивания, эта статья для вас. Мы собрали самые эффективные и простые техники, которые помогут вам создавать красивые работы с самого начала.',
    'Освойте основные техники раскрашивания, которые помогут вам создавать красивые работы даже без предыдущего опыта.',
    '/placeholder.svg?height=600&width=1200&query=coloring+techniques',
    true,
    NOW() - interval '10 days',
    NOW() - interval '15 days',
    NOW() - interval '5 days',
    'Администратор'
  ),
  (
    gen_random_uuid(),
    'Раскраски для детей: польза для развития',
    'coloring-pages-benefits-for-children',
    'Раскраски — это не просто способ занять ребенка. Они играют важную роль в развитии многих навыков и способностей.',
    'Узнайте, как раскраски способствуют развитию мелкой моторики, концентрации внимания и творческого мышления у детей.',
    '/placeholder.svg?height=600&width=1200&query=children+coloring',
    true,
    NOW() - interval '15 days',
    NOW() - interval '20 days',
    NOW() - interval '10 days',
    'Администратор'
  ),
  (
    gen_random_uuid(),
    'Арт-терапия: исцеление через творчество',
    'art-therapy-healing-through-creativity',
    'Арт-терапия — это форма психотерапии, которая использует творческий процесс создания искусства для улучшения физического, психического и эмоционального благополучия.',
    'Исследуйте, как раскраски и другие формы искусства используются в арт-терапии для улучшения психологического благополучия.',
    '/placeholder.svg?height=600&width=1200&query=art+therapy+coloring',
    true,
    NOW() - interval '20 days',
    NOW() - interval '25 days',
    NOW() - interval '15 days',
    'Администратор'
  ),
  (
    gen_random_uuid(),
    'История раскрасок: от детских книжек до мирового тренда',
    'coloring-books-history',
    'Раскраски имеют удивительно богатую историю, которая насчитывает несколько столетий.',
    'Проследите эволюцию раскрасок от их скромных начинаний до современного феномена, охватившего миллионы людей по всему миру.',
    '/placeholder.svg?height=600&width=1200&query=vintage+coloring+books',
    true,
    NOW() - interval '25 days',
    NOW() - interval '30 days',
    NOW() - interval '20 days',
    'Администратор'
  );

-- Add blog categories if they don't exist
INSERT INTO blog_categories (id, name, slug, created_at)
VALUES 
  (gen_random_uuid(), 'Творчество', 'creativity', NOW()),
  (gen_random_uuid(), 'Мастер-классы', 'tutorials', NOW()),
  (gen_random_uuid(), 'Вдохновение', 'inspiration', NOW()),
  (gen_random_uuid(), 'Советы начинающим', 'beginner-tips', NOW())
ON CONFLICT (slug) DO NOTHING;

-- Add blog tags if they don't exist
INSERT INTO blog_tags (id, name, slug, created_at)
VALUES 
  (gen_random_uuid(), 'Раскраски', 'coloring-pages', NOW()),
  (gen_random_uuid(), 'Акварель', 'watercolor', NOW()),
  (gen_random_uuid(), 'Для детей', 'for-kids', NOW()),
  (gen_random_uuid(), 'Техники рисования', 'drawing-techniques', NOW()),
  (gen_random_uuid(), 'Арт-терапия', 'art-therapy', NOW())
ON CONFLICT (slug) DO NOTHING;

-- Connect posts to categories
WITH 
  posts AS (
    SELECT id, slug FROM blog_posts
  ),
  categories AS (
    SELECT id, slug FROM blog_categories
  )
INSERT INTO blog_posts_categories (blog_post_id, blog_category_id)
SELECT 
  p.id,
  c.id
FROM 
  posts p,
  categories c
WHERE 
  (p.slug = 'how-coloring-reduces-stress' AND c.slug = 'inspiration') OR
  (p.slug = 'best-coloring-techniques-for-beginners' AND c.slug = 'tutorials') OR
  (p.slug = 'coloring-pages-benefits-for-children' AND c.slug = 'creativity') OR
  (p.slug = 'art-therapy-healing-through-creativity' AND c.slug = 'inspiration') OR
  (p.slug = 'coloring-books-history' AND c.slug = 'creativity')
ON CONFLICT DO NOTHING;

-- Return the count of blog posts
SELECT COUNT(*) AS blog_posts_count FROM blog_posts;
