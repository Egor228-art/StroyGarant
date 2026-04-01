import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 });
    }
    
    // Используем правильную переменную окружения
    const connectionString = process.env.POSTGRES_URL_STROY || process.env.POSTGRES_URL;
    
    let db;
    if (connectionString && connectionString !== process.env.POSTGRES_URL) {
      const { neon } = require('@neondatabase/serverless');
      db = neon(connectionString);
    } else {
      db = sql;
    }
    
    // Ищем пользователя
    const users = await db`SELECT id, email, name, password FROM users WHERE email = ${email}`;
    
    if (users.length === 0) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }
    
    const user = users[0];
    
    // Сравниваем пароль
    const isValid = await bcrypt.compare(password, user.password);
    
    if (isValid) {
      return NextResponse.json({ 
        success: true, 
        user: { id: user.id, email: user.email, name: user.name }
      });
    } else {
      return NextResponse.json({ error: "Пароль неверный" }, { status: 401 });
    }
    
  } catch (error) {
    console.error("Ошибка:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}