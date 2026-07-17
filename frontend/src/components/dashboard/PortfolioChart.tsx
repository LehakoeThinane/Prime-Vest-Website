"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "./DashboardUI";

type Snapshot = { date: string; total_value: string };

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-surface-border bg-background px-3 py-2 text-xs shadow-lg">
      <p className="text-muted">{label ? formatDate(label) : ""}</p>
      <p className="font-semibold">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export function PortfolioChart({ snapshots }: { snapshots: Snapshot[] }) {
  const [showTable, setShowTable] = useState(false);

  if (snapshots.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-surface-border p-8 text-center text-sm text-muted">
        No portfolio history yet - your first deposit or investment will start your performance chart.
      </div>
    );
  }

  const data = snapshots.map((s) => ({ date: s.date, value: Number(s.total_value) }));
  const latest = data[data.length - 1];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted">Account value</p>
          <p className="text-2xl font-semibold">{formatCurrency(latest.value)}</p>
        </div>
        <button
          onClick={() => setShowTable((v) => !v)}
          className="text-xs text-gold-500 underline underline-offset-4"
        >
          {showTable ? "Show chart" : "View as table"}
        </button>
      </div>

      {showTable ? (
        <div className="max-h-72 overflow-y-auto rounded-lg border border-surface-border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-surface text-left text-xs text-muted">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map((point) => (
                <tr key={point.date} className="border-t border-surface-border">
                  <td className="px-3 py-2">{formatDate(point.date)}</td>
                  <td className="px-3 py-2 font-medium">{formatCurrency(point.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-line)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--chart-line)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 11, fill: "var(--muted)" }}
                axisLine={{ stroke: "var(--chart-grid)" }}
                tickLine={false}
                minTickGap={24}
              />
              <YAxis
                tickFormatter={(v) => formatCurrency(v)}
                tick={{ fontSize: 11, fill: "var(--muted)" }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--chart-line)"
                strokeWidth={2}
                fill="url(#portfolioFill)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
