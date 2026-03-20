"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, TextInput } from "../ui";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  return <Card className="mx-auto max-w-md"><form className="space-y-4" onSubmit={async (event) => {
    event.preventDefault();
    setLoading(true); setError(null);
    const formData = new FormData(event.currentTarget);
    const res = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(formData.entries())) });
    setLoading(false);
    if (!res.ok) { const data = await res.json(); setError(data.error || "Request failed"); return; }
    router.push("/dashboard"); router.refresh();
  }}>
    <div><h1 className="text-2xl font-semibold">{mode === "login" ? "Welcome back" : "Create your DOMQA account"}</h1><p className="mt-2 text-sm text-slate-400">{mode === "login" ? "Sign in to manage captured issues." : "Start capturing frontend bugs with element context."}</p></div>
    {mode === "signup" && <TextInput name="name" placeholder="Your name" required />}
    <TextInput name="email" type="email" placeholder="name@company.com" required />
    <TextInput name="password" type="password" placeholder="••••••••" required />
    {error && <p className="text-sm text-rose-400">{error}</p>}
    <Button type="submit" className="w-full">{loading ? "Working..." : mode === "login" ? "Sign in" : "Create account"}</Button>
  </form></Card>;
}
