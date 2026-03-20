import { NextResponse } from 'next/server';
import { requireApiUser } from '@/server/auth/guards';
export async function GET() { try { const user = await requireApiUser(); return NextResponse.json({ id: user.id, name: user.name, email: user.email }); } catch (error) { if (error instanceof Response) return error; return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); } }
