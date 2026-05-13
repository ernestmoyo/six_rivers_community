import type { ReactNode } from "react";
import { Waves } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-stone bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-md items-center gap-3 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EC5C2B]">
            <Waves className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold uppercase tracking-wider">Six Rivers</span>
            <span className="text-[10px] font-medium opacity-70 uppercase tracking-widest">
              M&amp;E Field App
            </span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-md px-4 py-8 sm:px-6 sm:py-12">{children}</main>
    </div>
  );
}
