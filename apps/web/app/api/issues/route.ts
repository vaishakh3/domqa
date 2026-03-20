import { NextResponse } from 'next/server';
import { requireApiUser } from '@/server/auth/guards';
import { createIssue, listIssues } from '@/server/services/issues';
export async function GET(request: Request) { try { const user = await requireApiUser(); const url = new URL(request.url); return NextResponse.json(await listIssues(user.id, url.searchParams)); } catch (error) { if (error instanceof Response) return error; return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); } }
export async function POST(request: Request) { try { const user = await requireApiUser(); const body = await request.json(); return NextResponse.json(await createIssue(user.id, body)); } catch (error) { if (error instanceof Response) return error; return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create issue' }, { status: 400 }); } }
