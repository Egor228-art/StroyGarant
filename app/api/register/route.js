import { createUser, getUserByEmail, initTables } from "../../lib";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await initTables();
    
    const { email, password, name, phone } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: "Заполните поля" }, { status: 400 });
    }
    
    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Email уже зарегистрирован" }, { status: 400 });
    }
    
    const user = await createUser(email, password, name, phone);
    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}