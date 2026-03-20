import Link from "next/link";
import { Container, PageShell } from "../../components/ui";
import { AuthForm } from "../../components/forms/auth-form";
export default function LoginPage() { return <PageShell><Container className="py-20"><AuthForm mode="login" /><p className="mt-6 text-center text-sm text-slate-400">No account yet? <Link href="/signup">Create one</Link>.</p></Container></PageShell>; }
