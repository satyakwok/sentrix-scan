"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ValidatorChart({ data }: { data: { hour: string; count: number }[] }) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="v-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--gold)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--brd)" strokeDasharray="2 4" />
          <XAxis dataKey="hour" fontSize={10} stroke="var(--tx-d)" tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis fontSize={10} stroke="var(--tx-d)" tickLine={false} axisLine={false} width={28} />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--brd)",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value) => [`${value} blocks`, "Produced"]}
          />
          <Area type="monotone" dataKey="count" stroke="var(--gold)" strokeWidth={2} fill="url(#v-grad)" activeDot={{ r: 4, fill: "var(--gold)", stroke: "var(--bk)", strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
