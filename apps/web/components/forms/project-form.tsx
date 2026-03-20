"use client";
import { useRouter } from "next/navigation";
import { Button, Card, TextArea, TextInput } from "../ui";
import { useState } from "react";
export function ProjectForm() {
  const router = useRouter(); const [error, setError] = useState<string | null>(null);
  return <Card className="max-w-xl"><form className="space-y-4" onSubmit={async (event)=>{event.preventDefault(); setError(null); const data = Object.fromEntries(new FormData(event.currentTarget).entries()); const res = await fetch('/api/projects',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); if(!res.ok){setError((await res.json()).error||'Unable to create project'); return;} const project = await res.json(); router.push(`/projects/${project.id}`);}}><TextInput name="name" placeholder="Acme storefront" required /><TextInput name="slug" placeholder="acme-storefront" required /><TextArea name="description" placeholder="Short context for this project." />{error && <p className="text-sm text-rose-400">{error}</p>}<Button type="submit">Create project</Button></form></Card>;
}
