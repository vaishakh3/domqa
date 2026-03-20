import { NextResponse } from 'next/server';
import { requireApiUser } from '@/server/auth/guards';
import { prisma } from '@/server/db';
export async function GET(_: Request, { params }: { params: Promise<{ projectId: string }>}) { try { const user = await requireApiUser(); const { projectId } = await params; const issues = await prisma.issue.findMany({ where: { projectId, project: { ownerId: user.id } }, orderBy: { createdAt: 'desc' } }); return NextResponse.json(issues); } catch (error) { if (error instanceof Response) return error; return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); } }
