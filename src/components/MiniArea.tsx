import { Area, AreaChart, ResponsiveContainer } from "recharts";

export function MiniArea({ data, positive = true, height = 40 }: { data: number[]; positive?: boolean; height?: number }) {
  const stroke = positive ? "var(--up-foreground)" : "var(--down-foreground)";
  const id = `ma-${positive ? "u" : "d"}-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <AreaChart data={data.map((v, i) => ({ i, v }))} margin={{ top: 1, right: 0, bottom: 1, left: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.3} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={stroke} strokeWidth={1.5} fill={`url(#${id})`} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
