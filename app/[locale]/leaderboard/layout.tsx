import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Trophy } from "lucide-react";
import { CategoryNav } from "@/components/leaderboard/CategoryNav";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Rankings across Sentrix Chain — accounts, tokens, validators, contracts, and whale activity.",
};

export default function LeaderboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-3 flex-wrap mb-6">
        <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <Trophy className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Rankings</p>
          <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6">
        {/* Sidebar (lg+) */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <CategoryNav />
          </div>
        </aside>

        {/* Mobile: horizontal category scroller */}
        <div className="lg:hidden overflow-x-auto -mx-4 px-4 pb-2">
          <CategoryNav />
        </div>

        <div className="min-w-0 space-y-4">{children}</div>
      </div>
    </div>
  );
}
