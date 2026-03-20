import { NextResponse } from 'next/server';
import { loginSchema } from '@domqa/shared/schemas';
import { prisma } from '@/server/db';
import { createSession } from '@/server/auth/session';
import { verify } from '@/lib/password';
export async function POST(request: Request) { try { const data = loginSchema.parse(await request.json()); const user = await prisma.user.findUnique({ where: { email: data.email } }); if (!user || !verify(data.password, user.passwordHash)) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }); await createSession(user.id); return NextResponse.json({ id: user.id, email: user.email }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid request' }, { status: 400 }); } }
