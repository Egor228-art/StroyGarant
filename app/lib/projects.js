import { sql } from '@vercel/postgres';

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