"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextArea } from '../ui';
export function CommentForm({ issueId }: { issueId: string }) { const [body, setBody] = useState(''); const [error, setError] = useState<string | null>(null); const router = useRouter(); return <form className="space-y-3" onSubmit={async (event)=>{event.preventDefault(); setError(null); const res = await fetch(`/api/issues/${issueId}/comments`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ body })}); if(!res.ok){setError((await res.json()).error||'Unable to add comment'); return;} setBody(''); router.refresh(); }}><TextArea value={body} onChange={(event)=>setBody(event.target.value)} placeholder="Add implementation notes, reproduction details, or QA follow-up." />{error && <p className="text-sm text-rose-400">{error}</p>}<Button type="submit">Add comment</Button></form>; }
