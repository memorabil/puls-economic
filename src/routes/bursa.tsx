import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { betIndex, companies, companySeries } from "@/lib/mock-data";
import { fmtNum, fmtPct, pctChange } from "@/lib/format";
import { LineCard } from "@/components/LineCard";
import { Sparkline } from "@/components/Sparkline";
import { ArrowDownRight, ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bursa")({
  head: () => ({
    meta: [
      { title: "Bursă & Companii — Economia României" },
      { name: "description", content: "Indicele BET și principalele companii românești listate la BVB." },
    ],
  }),
  component: BursaPage,
});

function BursaPage() {
  const [selected, setSelected] = useState("H2O");
  const c = companies.find((x) => x.ticker === selected)!;
  const series = useMemo(() => companySeries(selected), [selected]);
  const ch = pctChange(c.price, c.prev);

  const sorted = [...companies].map((x) => ({ ...x, ch: pctChange(x.price, x.prev) }));
  const gainers = [...sorted].sort((a, b) => b.ch - a.ch).slice(0, 5);
  const losers = [...sorted].sort((a, b) => a.ch - b.ch).slice(0, 5);

  const betCh = pctChange(betIndex.value, betIndex.prev);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Bursă & Companii</h1>
        <p className="mt-2 text-muted-foreground text-[15px]">Indicele BET și principalele companii listate la BVB.</p>
      </header>

      {/* BET Index */}
      <section className="rounded-3xl bg-gradient-to-br from-pastel-butter/40 to-pastel-peach/30 p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[13px] font-medium text-muted-foreground">Indicele BET</div>
            <div className="mt-1 text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums">{fmtNum(betIndex.value)}</div>
            <div className={cn("mt-2 inline-flex items-center gap-1 text-[13px] font-medium rounded-full px-2 py-0.5",
              betCh >= 0 ? "bg-up/40 text-up-foreground" : "bg-down/40 text-down-foreground")}>
              {betCh >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {fmtPct(betCh)} astăzi
            </div>
          </div>
          <div className="w-full sm:w-[60%]">
            <LineCard data={betIndex.series} positive={betCh >= 0} height={180} formatter={(v) => fmtNum(v, 0)} />
          </div>
        </div>
      </section>

      {/* Top gainers / losers */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TopList title="Top câștigători" icon={<TrendingUp className="h-4 w-4 text-up-foreground" />} items={gainers} positive />
        <TopList title="Top pierzători" icon={<TrendingDown className="h-4 w-4 text-down-foreground" />} items={losers} positive={false} />
      </section>

      {/* Selected company chart */}
      <section className="rounded-3xl bg-card soft-shadow p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[12px] uppercase tracking-wide text-muted-foreground font-medium">{c.ticker} · {c.sector}</div>
            <div className="text-2xl font-semibold tracking-tight">{c.name}</div>
            <div className="mt-2 flex items-baseline gap-3">
              <div className="text-3xl font-semibold tabular-nums">{fmtNum(c.price, c.price < 1 ? 4 : 2)} <span className="text-base font-medium text-muted-foreground">RON</span></div>
              <div className={cn("inline-flex items-center gap-1 text-[13px] font-medium rounded-full px-2 py-0.5",
                ch >= 0 ? "bg-up/40 text-up-foreground" : "bg-down/40 text-down-foreground")}>
                {fmtPct(ch)}
              </div>
            </div>
            <div className="mt-1 text-[12.5px] text-muted-foreground">Capitalizare: {fmtNum(c.mcap)} mld. RON</div>
          </div>
        </div>
        <div className="mt-5">
          <LineCard data={series} positive={ch >= 0} height={260} formatter={(v) => v.toFixed(c.price < 1 ? 4 : 2)} />
        </div>
      </section>

      {/* All companies */}
      <section>
        <h2 className="text-xl font-semibold tracking-tight mb-5">Companii listate</h2>
        <div className="rounded-3xl bg-card soft-shadow overflow-hidden">
          <div className="hidden sm:grid grid-cols-[80px_1fr_120px_100px_120px_140px] px-6 py-3 text-[12px] font-medium text-muted-foreground border-b border-border/60">
            <div>Ticker</div><div>Companie</div><div className="text-right">Preț</div><div className="text-right">Variație</div><div className="text-right">Cap. (mld)</div><div className="text-right">Trend</div>
          </div>
          {sorted.map((co) => {
            const u = co.ch >= 0;
            return (
              <button key={co.ticker} onClick={() => setSelected(co.ticker)}
                className="w-full grid grid-cols-3 sm:grid-cols-[80px_1fr_120px_100px_120px_140px] items-center gap-3 px-6 py-4 hover:bg-muted/40 transition border-b border-border/40 last:border-0 text-left">
                <div className="font-medium">{co.ticker}</div>
                <div>
                  <div className="font-medium text-[14px]">{co.name}</div>
                  <div className="text-[11.5px] text-muted-foreground">{co.sector}</div>
                </div>
                <div className="text-right tabular-nums font-medium">{fmtNum(co.price, co.price < 1 ? 4 : 2)}</div>
                <div className={cn("text-right text-[13px] font-medium", u ? "text-up-foreground" : "text-down-foreground")}>{fmtPct(co.ch)}</div>
                <div className="hidden sm:block text-right tabular-nums text-muted-foreground text-[13px]">{fmtNum(co.mcap, 1)}</div>
                <div className="hidden sm:block h-9"><Sparkline data={companySeries(co.ticker)} positive={u} /></div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function TopList({ title, icon, items, positive }: { title: string; icon: React.ReactNode; items: { ticker: string; name: string; ch: number }[]; positive: boolean }) {
  return (
    <div className="rounded-3xl bg-card soft-shadow p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className={cn("h-7 w-7 rounded-xl flex items-center justify-center", positive ? "bg-up/40" : "bg-down/40")}>{icon}</div>
        <div className="font-medium">{title}</div>
      </div>
      <ul className="divide-y divide-border/50">
        {items.map((it) => (
          <li key={it.ticker} className="py-2.5 flex items-center justify-between">
            <div>
              <div className="text-[13.5px] font-medium">{it.ticker}</div>
              <div className="text-[11.5px] text-muted-foreground">{it.name}</div>
            </div>
            <div className={cn("text-[13px] font-medium tabular-nums", positive ? "text-up-foreground" : "text-down-foreground")}>{fmtPct(it.ch)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
