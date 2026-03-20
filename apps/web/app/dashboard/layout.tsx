import { ReactNode } from "react";
import { requireUser } from "../../server/auth/guards";
import { Container, PageShell, ShellNav } from "../../components/ui";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  return <PageShell><div className="flex min-h-screen"><ShellNav /><div className="flex-1"><header className="border-b border-slate-800 bg-slate-950/80"><Container className="flex items-center justify-between py-4"><div><p className="text-sm text-slate-400">Logged in as</p><p className="font-medium">{user.email}</p></div><form action="/api/auth/logout" method="post"><button className="border border-slate-700 text-slate-100">Logout</button></form></Container></header><main><Container className="py-8">{children}</Container></main></div></div></PageShell>;
}
