import { NextResponse } from 'next/server';
import { signupSchema } from '@domqa/shared/schemas';
import { prisma } from '@/server/db';
import { createSession } from '@/server/auth/session';
import { hash } from '@/lib/password';
export async function POST(request: Request) { try { const data = signupSchema.parse(await request.json()); const exists = await prisma.user.findUnique({ where: { email: data.email } }); if (exists) return NextResponse.json({ error: 'Email already in use' }, { status: 400 }); const user = await prisma.user.create({ data: { name: data.name, email: data.email, passwordHash: hash(data.password) } }); await createSession(user.id); return NextResponse.json({ id: user.id, email: user.email }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid request' }, { status: 400 }); } }
