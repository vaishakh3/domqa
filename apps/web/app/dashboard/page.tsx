import Link from "next/link";
import { Card } from "../../components/ui";
import { requireUser } from "../../server/auth/guards";
import { listProjects } from "../../server/services/projects";
import { prisma } from "../../server/db";

export default async function DashboardPage() {
  const user = await requireUser();
  const [projects, recentIssues] = await Promise.all([
    listProjects(user.id),
    prisma.issue.findMany({ where: { project: { ownerId: user.id } }, include: { project: true }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  return <div className="space-y-8"><section className="grid gap-4 md:grid-cols-3">{[{label:"Projects",value:projects.length},{label:"Open issues",value:recentIssues.filter((issue)=>issue.status==="open").length},{label:"Recent captures",value:recentIssues.length}].map((stat)=><Card key={stat.label}><p className="text-sm text-slate-400">{stat.label}</p><p className="mt-2 text-3xl font-semibold">{stat.value}</p></Card>)}</section><section><div className="mb-4 flex items-center justify-between"><h1 className="text-2xl font-semibold">Projects</h1><Link href="/projects/new">Create project</Link></div><div className="grid gap-4 md:grid-cols-2">{projects.map((project)=><Card key={project.id}><div className="flex items-start justify-between"><div><h2 className="text-lg font-semibold">{project.name}</h2><p className="mt-1 text-sm text-slate-400">{project.description}</p></div><span className="rounded-full bg-slate-800 px-3 py-1 text-xs">{project._count.issues} issues</span></div><div className="mt-4 flex gap-3 text-sm"><Link href={`/projects/${project.id}`}>Open project</Link><Link href={`/projects/${project.id}/settings`}>Settings</Link></div></Card>)}</div></section><section><h2 className="mb-4 text-xl font-semibold">Recent issues</h2><Card className="overflow-hidden p-0"><table className="min-w-full text-left text-sm"><thead className="bg-slate-900"><tr><th className="px-4 py-3">Key</th><th>Title</th><th>Project</th><th>Status</th></tr></thead><tbody>{recentIssues.map((issue)=><tr key={issue.id} className="border-t border-slate-800"><td className="px-4 py-3"><Link href={`/issues/${issue.id}`}>{issue.key}</Link></td><td>{issue.title}</td><td>{issue.project.name}</td><td>{issue.status}</td></tr>)}</tbody></table></Card></section></div>;
}
