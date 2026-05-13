import type { ReactNode } from "react";
import Link from "next/link";
import { Waves } from "lucide-react";
import { OfficerGuard } from "@/components/auth/officer-guard";

export default function SubmitLayout({ children }: { children: ReactNode }) {
  return (
    <OfficerGuard>
      <div className="min-h-screen bg-cream">
        {/* Brand header */}
        <header className="sticky top-0 z-30 border-b border-stone bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EC5C2B]">
              <Waves className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold uppercase tracking-wider">Six Rivers</span>
              <span className="text-[10px] font-medium opacity-70 uppercase tracking-widest">
                Community Intelligence
              </span>
            </div>
            <Link
              href="/dashboard"
              className="ml-auto text-xs opacity-70 hover:opacity-100 transition"
            >
              Open Dashboard →
            </Link>
          </div>
        </header>

        {/* Form body */}
        <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>

        {/* Footer */}
        <footer className="mx-auto max-w-3xl px-6 py-6 text-center text-xs text-muted-foreground">
          Six Rivers Africa · Submissions go directly to the central database.
        </footer>
      </div>
    </OfficerGuard>
  );
}
