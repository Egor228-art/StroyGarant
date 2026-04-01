import { sql } from '@vercel/postgres';
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { rows } = await sql`SELECT id, email, name, LEFT(password, 30) as password_preview, LENGTH(password) as password_length FROM users ORDER BY id DESC LIMIT 10`;
    return NextResponse.json({ success: true, users: rows });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}