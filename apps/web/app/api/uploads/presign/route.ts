import { NextResponse } from 'next/server';
import { requireApiUser } from '@/server/auth/guards';
import { saveBase64Image } from '@/server/services/uploads';
export async function POST(request: Request) { try { await requireApiUser(); const { dataUrl } = await request.json(); const url = dataUrl ? await saveBase64Image(dataUrl) : null; return NextResponse.json({ url }); } catch (error) { if (error instanceof Response) return error; return NextResponse.json({ error: error instanceof Error ? error.message : 'Upload failed' }, { status: 400 }); } }
