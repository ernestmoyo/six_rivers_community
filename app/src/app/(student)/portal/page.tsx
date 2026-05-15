import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function PortalHome() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-br from-emerald-100 to-amber-50 p-8 dark:from-emerald-900/40 dark:to-amber-950/20">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-900 dark:bg-slate-900/60 dark:text-emerald-200">
            <Sparkles className="h-3 w-3" />
            SRATA Academy · Kamilifu
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Your journey in hospitality starts here.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            Track your assessments, internship placements, and tracer
            follow-ups in one place. Apply for an account once your cohort
            opens — your project officer will approve it.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Link
              href="/portal/apply"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              Request access
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/portal/sign-in"
              className="inline-flex items-center gap-1.5 rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-emerald-900 transition-colors hover:bg-emerald-50 dark:bg-slate-900 dark:text-emerald-200"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <FeatureCard
          icon={GraduationCap}
          title="My journey"
          description="Cohort, enrolment dates, and graduation status — all in one view."
          href="/portal/journey"
        />
        <FeatureCard
          icon={Briefcase}
          title="Internships"
          description="See where you've been placed and read your evaluations."
          href="/portal/internships"
        />
        <FeatureCard
          icon={FileText}
          title="Assessments"
          description="Your assessment scores and exit-survey responses."
          href="/portal/scores"
        />
      </section>

      <section className="rounded-xl border bg-white/60 p-6 dark:bg-slate-950/60">
        <h2 className="text-lg font-semibold">About this portal</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          SRATA Academy is a full-scholarship one-year hospitality programme
          for youth from communities adjacent to the national park. Each
          cohort joins, trains for a year, completes an industry internship,
          and graduates into a hospitality-sector role. Six Rivers Africa
          runs the programme; this portal is the read-only window for
          students into their own records.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Project officers manage the underlying data via the staff
          platform. Account approval is handled by them.
        </p>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: typeof GraduationCap;
  title: string;
  description: string;
  href: string;
}

function FeatureCard({ icon: Icon, title, description, href }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-xl border bg-white/70 p-5 transition-all hover:shadow-md dark:bg-slate-950/60"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-700 group-hover:gap-2 dark:text-emerald-300">
        Open
        <ArrowRight className="h-3 w-3 transition-all" />
      </div>
    </Link>
  );
}
