import { NextResponse } from 'next/server';
import { requireApiUser } from '@/server/auth/guards';
import { createProject, listProjects } from '@/server/services/projects';
export async function GET() { try { const user = await requireApiUser(); return NextResponse.json(await listProjects(user.id)); } catch (error) { if (error instanceof Response) return error; return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); } }
export async function POST(request: Request) { try { const user = await requireApiUser(); return NextResponse.json(await createProject(user.id, await request.json())); } catch (error) { if (error instanceof Response) return error; return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create project' }, { status: 400 }); } }
