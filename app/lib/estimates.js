import { sql } from '@vercel/postgres';

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