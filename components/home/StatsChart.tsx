"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity } from "lucide-react";
import type { BlockData } from "@/lib/api";
import { toMillis } from "@/lib/format";

type Range = "1h" | "6h" | "24h";

// DECISION: no backend /chain/performance endpoint yet; derive block-rate series from the recent
// blocks window we already poll. Bucketed by minute, extended to the selected range.
// TODO(api): needs GET /chain/performance?range=1h|6h|24h — currently computed client-side.
function buildSeries(blocks: BlockData[] | null, range: Range): { t: string; tps: number }[] {
  if (!blocks || blocks.length < 2) return [];
  const windowMs = { "1h": 60 * 60 * 1000, "6h": 6 * 60 * 60 * 1000, "24h": 24 * 60 * 60 * 1000 }[range];
  const now = Date.now();
  const bucketMs = windowMs / 30;
  const series: Record<number, number> = {};

  blocks.forEach((b) => {
    const ts = toMillis(b.timestamp);
    if (now - ts > windowMs) return;
    const bucket = Math.floor((now - ts) / bucketMs);
    // DECISION: list endpoint only sends tx_count (not the transactions array); prefer it
    // when present. Includes coinbase tx per block — matches Solscan's "TPS" convention.
    const txCount = b.tx_count ?? b.transactions?.length ?? 0;
    series[bucket] = (series[bucket] || 0) + txCount;
  });

  const out: { t: string; tps: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const ms = i * bucketMs;
    const minutesAgo = Math.round(ms / 60_000);
    const label = minutesAgo === 0 ? "now" : `${minutesAgo}m`;
    out.push({ t: label, tps: (series[i] ?? 0) / (bucketMs / 1000) });
  }
  return out;
}

export function StatsChart({ blocks }: { blocks: BlockData[] | null }) {
  const [range, setRange] = useState<Range>("1h");
  const data = useMemo(() => buildSeries(blocks, range), [blocks, range]);
  const peak = useMemo(() => (data.length ? Math.max(...data.map((d) => d.tps)) : 0), [data]);
  const hasSignal = data.some((d) => d.tps > 0);

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between gap-3 flex-wrap">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[var(--gold)]" />
          <span className="font-mono text-[10px] tracking-[.22em] uppercase text-[var(--tx-d)]">Transactions Per Second</span>
          <span className="text-xs text-muted-foreground font-normal ml-2 font-mono">peak {peak.toFixed(2)} tps</span>
        </CardTitle>
        <div className="flex items-center gap-1">
          {(["1h", "6h", "24h"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                range === r
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {!hasSignal ? (
          <div className="h-48 flex flex-col items-center justify-center text-center gap-2 border border-dashed border-[var(--brd)] rounded-lg bg-[color-mix(in_oklab,var(--muted)_30%,transparent)]">
            <Activity className="h-6 w-6 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No throughput in the last {range}</p>
            <p className="text-xs text-muted-foreground/70 font-mono">Chart populates after the first transaction in-window.</p>
          </div>
        ) : (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="tps-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" fontSize={10} stroke="var(--tx-d)" tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis fontSize={10} stroke="var(--tx-d)" tickLine={false} axisLine={false} width={28} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--brd)", borderRadius: 8, fontSize: 12 }}
                  formatter={(value) => [`${Number(value).toFixed(2)} tps`, "TPS"]}
                />
                <Area type="monotone" dataKey="tps" stroke="var(--gold)" strokeWidth={2} fill="url(#tps-grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
