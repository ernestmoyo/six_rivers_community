/**
 * Student portal layout (Phase 3, Eliud's request).
 *
 * Lives behind its own route group `(student)` so it doesn't inherit the
 * officer-PIN guard from `(main)`. Students authenticate separately via
 * StudentAccount; until that's wired up this is a public landing.
 */
import Link from "next/link";
import { GraduationCap, Home, Briefcase, FileText, LogIn } from "lucide-react";

const nav = [
  { href: "/portal", label: "Home", icon: Home },
  { href: "/portal/journey", label: "My journey", icon: GraduationCap },
  { href: "/portal/internships", label: "Internships", icon: Briefcase },
  { href: "/portal/scores", label: "Assessments", icon: FileText },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 dark:from-emerald-950/30 dark:via-slate-950 dark:to-amber-950/20">
      <header className="border-b bg-white/70 backdrop-blur-sm dark:bg-slate-950/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/portal"
            className="flex items-center gap-2 text-sm font-bold tracking-tight"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <GraduationCap className="h-4 w-4" />
            </span>
            SRATA Student Portal
          </Link>
          <nav className="hidden gap-1 sm:flex">
            {nav.map((n) => {
              const Icon = n.icon;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-emerald-100 hover:text-emerald-900 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-200"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {n.label}
                </Link>
              );
            })}
            <Link
              href="/portal/sign-in"
              className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-10">
        {children}
      </main>

      <footer className="border-t bg-white/60 py-4 text-center text-[11px] text-muted-foreground dark:bg-slate-950/60">
        SRATA Academy · Kamilifu · Six Rivers Africa
      </footer>
    </div>
  );
}
