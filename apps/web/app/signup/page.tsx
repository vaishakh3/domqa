import Link from "next/link";
import { Container, PageShell } from "../../components/ui";
import { AuthForm } from "../../components/forms/auth-form";
export default function SignupPage() { return <PageShell><Container className="py-20"><AuthForm mode="signup" /><p className="mt-6 text-center text-sm text-slate-400">Already have an account? <Link href="/login">Sign in</Link>.</p></Container></PageShell>; }
