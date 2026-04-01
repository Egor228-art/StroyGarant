import { getUserEstimates, saveEstimate, initTables } from "../../lib";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await initTables();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }
    
    const estimates = await getUserEstimates(session.user.id);
    return NextResponse.json({ success: true, estimates });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initTables();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }
    
    const { projectType, area, materialQuality, totalCost } = await request.json();
    const estimate = await saveEstimate(session.user.id, projectType, area, materialQuality, totalCost);
    
    return NextResponse.json({ success: true, estimate });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}