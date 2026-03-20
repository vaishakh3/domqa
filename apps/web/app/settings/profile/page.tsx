import { Card } from '../../../components/ui';
import { requireUser } from '../../../server/auth/guards';
export default async function ProfilePage(){ const user = await requireUser(); return <div className="space-y-6"><h1 className="text-2xl font-semibold">Profile</h1><Card><dl className="grid gap-4 md:grid-cols-2"><div><dt className="text-sm text-slate-400">Name</dt><dd>{user.name}</dd></div><div><dt className="text-sm text-slate-400">Email</dt><dd>{user.email}</dd></div></dl></Card></div>; }
