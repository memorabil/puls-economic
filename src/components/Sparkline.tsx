import { Area, AreaChart, ResponsiveContainer } from "recharts";

export function Sparkline({ data, positive = true }: { data: number[]; positive?: boolean }) {
  const points = data.map((v, i) => ({ i, v }));
  const id = `sl-${positive ? "u" : "d"}-${Math.random().toString(36).slice(2, 7)}`;
  const stroke = positive ? "var(--up-foreground)" : "var(--down-foreground)";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={stroke} strokeWidth={1.6} fill={`url(#${id})`} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
