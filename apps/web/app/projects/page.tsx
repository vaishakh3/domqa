import Link from "next/link";
import { Card } from "../../components/ui";
import { requireUser } from "../../server/auth/guards";
import { listProjects } from "../../server/services/projects";

export default async function ProjectsPage() {
  const user = await requireUser();
  const projects = await listProjects(user.id);
  return <div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-semibold">Projects</h1><p className="text-slate-400">Manage products, environments, and capture sources.</p></div><Link href="/projects/new">Create project</Link></div><div className="grid gap-4 md:grid-cols-2">{projects.map((project)=><Card key={project.id}><h2 className="text-lg font-semibold">{project.name}</h2><p className="mt-1 text-slate-400">{project.description || "No description yet."}</p><div className="mt-4 flex flex-wrap gap-2">{project.environments.map((env)=><span key={env.id} className="rounded-full bg-slate-800 px-3 py-1 text-xs">{env.name}</span>)}</div><Link className="mt-4 inline-block" href={`/projects/${project.id}`}>Open project</Link></Card>)}</div></div>;
}
