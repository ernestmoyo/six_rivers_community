import { Sidebar } from "@/components/layout/sidebar";
import { SyncWatcher } from "@/components/shared/sync-watcher";
import { BottomNav } from "@/components/shared/bottom-nav";
import { AskTheData } from "@/components/shared/ask-the-data";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pb-20 md:ml-64 md:pb-0">{children}</main>
      <SyncWatcher />
      <BottomNav />
      <AskTheData />
    </div>
  );
}
