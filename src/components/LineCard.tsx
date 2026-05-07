import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
  data: number[];
  labels?: string[];
  positive?: boolean;
  height?: number;
  yDomain?: [number | "auto", number | "auto"];
  formatter?: (v: number) => string;
}

export function LineCard({ data, labels, positive = true, height = 240, yDomain, formatter }: Props) {
  const series = data.map((v, i) => ({ i, label: labels?.[i] ?? String(i + 1), v }));
  const stroke = positive ? "var(--up-foreground)" : "var(--down-foreground)";

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <AreaChart data={series} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
          <defs>
            <linearGradient id="line-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.25} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
          <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} width={48} domain={yDomain ?? ["auto", "auto"]} tickFormatter={(v) => (formatter ? formatter(v) : String(v))} />
          <Tooltip
            contentStyle={{
              borderRadius: 14, border: "1px solid var(--border)", background: "var(--card)",
              fontSize: 12, boxShadow: "0 8px 24px -12px rgba(0,0,0,0.15)",
            }}
            labelStyle={{ color: "var(--muted-foreground)", fontSize: 11 }}
            formatter={(v: number) => [formatter ? formatter(v) : v.toFixed(2), ""]}
          />
          <Area type="monotone" dataKey="v" stroke={stroke} strokeWidth={2} fill="url(#line-fill)" isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
