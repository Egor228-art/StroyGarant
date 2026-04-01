import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

let tablesInitialized = false;

export async function initTables() {
  if (tablesInitialized) return;
  
  try {
    console.log('🔄 Создание таблиц...');
    
    // Таблица пользователей
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Таблица проектов
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        project_name VARCHAR(200) NOT NULL,
        project_type VARCHAR(50) NOT NULL,
        area DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'in_progress',
        estimated_cost DECIMAL(15,2),
        start_date DATE,
        end_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Таблица смет
    await sql`
      CREATE TABLE IF NOT EXISTS estimates (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        project_type VARCHAR(50) NOT NULL,
        area DECIMAL(10,2) NOT NULL,
        material_quality VARCHAR(20) DEFAULT 'standard',
        total_cost DECIMAL(15,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    tablesInitialized = true;
    console.log('✅ Все таблицы созданы');
  } catch (error) {
    console.error('❌ Ошибка при создании таблиц:', error.message);
  }
}

// ============ ПОЛЬЗОВАТЕЛИ ============
export async function getUserByEmail(email) {
  try {
    const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
    return rows[0];
  } catch (error) {
    console.error('Ошибка поиска:', error.message);
    return null;
  }
}

export async function createUser(email, password, name, phone = '') {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await sql`
      INSERT INTO users (email, password, name, phone)
      VALUES (${email}, ${hashedPassword}, ${name}, ${phone})
      RETURNING id, email, name
    `;
    return rows[0];
  } catch (error) {
    console.error('Ошибка создания:', error.message);
    throw error;
  }
}

// ============ ПРОЕКТЫ ============
export async function getUserProjects(userId) {
  try {
    const { rows } = await sql`
      SELECT * FROM projects 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;
    return rows;
  } catch (error) {
    console.error('Ошибка получения проектов:', error.message);
    return [];
  }
}

export async function createProject(userId, projectName, projectType, area, estimatedCost, startDate) {
  try {
    const { rows } = await sql`
      INSERT INTO projects (user_id, project_name, project_type, area, estimated_cost, start_date)
      VALUES (${userId}, ${projectName}, ${projectType}, ${area}, ${estimatedCost}, ${startDate})
      RETURNING *
    `;
    return rows[0];
  } catch (error) {
    console.error('Ошибка создания проекта:', error.message);
    throw error;
  }
}

// ============ СМЕТЫ ============
export async function getUserEstimates(userId) {
  try {
    const { rows } = await sql`
      SELECT * FROM estimates 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
      LIMIT 10
    `;
    return rows;
  } catch (error) {
    console.error('Ошибка получения смет:', error.message);
    return [];
  }
}

export async function saveEstimate(userId, projectType, area, materialQuality, totalCost) {
  try {
    const { rows } = await sql`
      INSERT INTO estimates (user_id, project_type, area, material_quality, total_cost)
      VALUES (${userId}, ${projectType}, ${area}, ${materialQuality}, ${totalCost})
      RETURNING *
    `;
    return rows[0];
  } catch (error) {
    console.error('Ошибка сохранения сметы:', error.message);
    throw error;
  }
}