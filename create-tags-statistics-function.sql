-- Создаем функцию для получения статистики использования тегов
CREATE OR REPLACE FUNCTION public.get_tags_usage_statistics()
RETURNS TABLE (
  tag_id UUID,
  tag_name TEXT,
  post_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bt.id AS tag_id,
    bt.name AS tag_name,
    COUNT(bpt.post_id) AS post_count
  FROM 
    blog_tags bt
  LEFT JOIN 
    blog_posts_tags bpt ON bt.id = bpt.tag_id
  GROUP BY 
    bt.id, bt.name
  ORDER BY 
    post_count DESC, bt.name ASC;
END;
$$;

-- Устанавливаем правильные разрешения
REVOKE ALL ON FUNCTION public.get_tags_usage_statistics() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_tags_usage_statistics() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_tags_usage_statistics() TO service_role;

-- Добавляем комментарий к функции
COMMENT ON FUNCTION public.get_tags_usage_statistics() IS 'Возвращает статистику использования тегов в блоге';
