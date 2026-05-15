import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

export default function ScoresPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
        <FileText className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold">Assessments</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Sign in to view your assessment results, course feedback, and exit
        survey responses.
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
