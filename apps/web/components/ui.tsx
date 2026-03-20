import Link from "next/link";
import { cn } from "../lib/utils";
import type { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) { return <div className="min-h-screen bg-slate-950 text-slate-100">{children}</div>; }
export function Container({ children, className }: { children: ReactNode; className?: string }) { return <div className={cn("mx-auto w-full max-w-7xl px-6", className)}>{children}</div>; }
export function Card({ children, className }: { children: ReactNode; className?: string }) { return <div className={cn("card p-6", className)}>{children}</div>; }
export function Button({ children, className, type = "button" }: { children: ReactNode; className?: string; type?: "button" | "submit" }) { return <button type={type} className={cn("bg-violet-500 text-white hover:bg-violet-400", className)}>{children}</button>; }
export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className={cn("w-full", props.className)} />; }
export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea {...props} className={cn("min-h-32 w-full", props.className)} />; }
export function ShellNav() {
  const links = [["Dashboard", "/dashboard"], ["Projects", "/projects"], ["Issues", "/issues"], ["Profile", "/settings/profile"]] as const;
  return <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-900/60 p-6 lg:block"><Link href="/dashboard" className="text-xl font-semibold text-white">DOMQA</Link><div className="mt-8 space-y-2">{links.map(([label, href]) => <Link key={href} href={href} className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">{label}</Link>)}</div></aside>;
}
