import { NextResponse } from 'next/server';
import { requireApiUser } from '@/server/auth/guards';
import { prisma } from '@/server/db';
export async function GET(_: Request, { params }: { params: Promise<{ projectId: string }>}) { try { const user = await requireApiUser(); const { projectId } = await params; const project = await prisma.project.findFirst({ where: { id: projectId, ownerId: user.id }, include: { environments: true, issues: true } }); if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 }); return NextResponse.json(project); } catch (error) { if (error instanceof Response) return error; return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); } }
