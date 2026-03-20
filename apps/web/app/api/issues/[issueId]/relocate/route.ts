import { NextResponse } from 'next/server';
import { requireApiUser } from '@/server/auth/guards';
import { getIssue } from '@/server/services/issues';
export async function POST(_: Request, { params }: { params: Promise<{ issueId: string }>}) { try { const user = await requireApiUser(); const { issueId } = await params; const issue = await getIssue(user.id, issueId); if (!issue) return NextResponse.json({ error: 'Not found' }, { status: 404 }); return NextResponse.json({ issueId: issue.id, pageUrl: issue.pageUrl, locator: issue.locator, hint: 'Use the shared locateElementFromFingerprint utility from the extension or future replay surface.' }); } catch (error) { if (error instanceof Response) return error; return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); } }
