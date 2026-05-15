/**
 * Placeholder sign-in page. Full NextAuth credentials provider over
 * StudentAccount lands later in Phase 3 — until then this just explains
 * the current state.
 */
import Link from "next/link";
import { LogIn, ArrowRight } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
        <LogIn className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold">Sign in</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Account approval is in progress. Once a project officer approves
        your account, you&apos;ll receive an email with sign-in instructions.
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        No account yet?
      </p>
      <Link
        href="/portal/apply"
        className="inline-flex items-center gap-1.5 rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 dark:bg-slate-900 dark:text-emerald-200"
      >
        Request access
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
