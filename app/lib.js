import { getDb } from './lib/db';
import bcrypt from 'bcryptjs';

let tablesInitialized = false;

export async function initTables() {
  if (tablesInitialized) return;
  
  try {
    const db = getDb();
    console.log('🔄 Создание таблиц...');
    
    await db`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    tablesInitialized = true;
    console.log('✅ Таблица users создана');
  } catch (error) {
    console.error('❌ Ошибка при создании таблиц:', error.message);
  }
}

export async function getUserByEmail(email) {
  try {
    const db = getDb();
    const { rows } = await db`SELECT * FROM users WHERE email = ${email}`;
    console.log(`🔍 Поиск пользователя ${email}: ${rows.length ? 'найден' : 'не найден'}`);
    return rows[0];
  } catch (error) {
    console.error('Ошибка поиска:', error.message);
    return null;
  }
}

export async function createUser(email, password, name, phone = '') {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const db = getDb();
    
    const { rows } = await db`
      INSERT INTO users (email, password, name, phone)
      VALUES (${email}, ${hashedPassword}, ${name}, ${phone})
      RETURNING id, email, name
    `;
    
    console.log(`✅ Пользователь создан: ${email}, ID: ${rows[0].id}`);
    return rows[0];
  } catch (error) {
    console.error('❌ Ошибка создания:', error.message);
    throw error;
  }
}