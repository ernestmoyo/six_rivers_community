/**
 * Placeholder — full "my journey" view lights up once student auth + a
 * /api/student-accounts/me endpoint exist. For now, an empty state so
 * the nav link doesn't 404.
 */
import { GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function JourneyPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
        <GraduationCap className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold">Sign in to see your journey</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Once you sign in, this view will show your cohort, enrolment dates,
        assessment scores, internship placement, and tracer survey
        responses — everything your project officer has on record for you.
      </p>
      <Link
        href="/portal/sign-in"
        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        Sign in
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
