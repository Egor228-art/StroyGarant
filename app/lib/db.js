import { sql } from '@vercel/postgres';

// Единая функция для получения клиента БД
export function getDb() {
  // Используем стандартный sql из @vercel/postgres
  // Он автоматически использует POSTGRES_URL из переменных окружения
  return sql;
}