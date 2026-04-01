import { getUserProjects, createProject, initTables } from "../../lib";
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
    
    const projects = await getUserProjects(session.user.id);
    return NextResponse.json({ success: true, projects });
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
    
    const { projectName, projectType, area, estimatedCost, startDate } = await request.json();
    const project = await createProject(session.user.id, projectName, projectType, area, estimatedCost, startDate);
    
    return NextResponse.json({ success: true, project });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}