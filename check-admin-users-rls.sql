-- Проверяем текущие RLS политики для таблицы admin_users
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'admin_users';
