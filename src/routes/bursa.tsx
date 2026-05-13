import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { betIndex, companies, companySeries, volumes } from "@/lib/mock-data";
import { fmtNum, fmtPct, pctChange } from "@/lib/format";
import { LineCard } from "@/components/LineCard";
import { Sparkline } from "@/components/Sparkline";
import { Disclaimer } from "@/components/Disclaimer";
import { TradingViewWidget } from "@/components/TradingViewWidget";
import { ArrowDownRight, ArrowUpRight, ArrowUpDown, TrendingDown, TrendingUp, Star, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bursa")({
  head: () => ({
    meta: [
      { title: "Bursă & Companii — PulsEconomic" },
      { name: "description", content: "Indicele BET și principalele companii românești listate la BVB." },
      { property: "og:title", content: "Bursă & Companii — PulsEconomic" },
      { property: "og:description", content: "Indicele BET, top câștigători și companiile românești listate la BVB." },
    ],
  }),
  component: BursaPage,
});

const sectors = ["Toate", "Energie", "Bănci", "Telecom", "Utilități", "Sănătate", "Materiale", "Investiții"] as const;
type SortKey = "price" | "ch" | "mcap";

function BursaPage() {
  const [sector, setSector] = useState<(typeof sectors)[number]>("Toate");
  const [sortKey, setSortKey] = useState<SortKey>("ch");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<string | null>(null);

  const enriched = companies.map((x) => ({ ...x, ch: pctChange(x.price, x.prev) }));
  const gainers = [...enriched].sort((a, b) => b.ch - a.ch).slice(0, 5);
  const losers = [...enriched].sort((a, b) => a.ch - b.ch).slice(0, 5);

  // Action of the day = top gainer (or selected)
  const aotd = useMemo(() => {
    if (selected) return enriched.find((x) => x.ticker === selected) ?? gainers[0];
    return gainers[0];
  }, [selected, enriched, gainers]);
  const aotdSeries = useMemo(() => companySeries(aotd.ticker), [aotd.ticker]);
  const aotdCh = aotd.ch;

  const filtered = enriched.filter((c) => sector === "Toate" || c.sector === sector);
  const sorted = [...filtered].sort((a, b) => {
    const va = a[sortKey] as number;
    const vb = b[sortKey] as number;
    return sortDir === "desc" ? vb - va : va - vb;
  });

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortKey(k); setSortDir("desc"); }
  };

  const betCh = pctChange(betIndex.value, betIndex.prev);
  const maxVol = Math.max(...volumes.map((v) => v.volume));

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Bursă &amp; Companii</h1>
        <p className="mt-2 text-muted-foreground text-[15px]">Indicele BET și principalele companii listate la BVB.</p>
      </header>
      <Disclaimer />

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
        <TopList title="Top câștigători" icon={<TrendingUp className="h-4 w-4 text-up-foreground" />} items={gainers} positive onPick={setSelected} />
        <TopList title="Top pierzători" icon={<TrendingDown className="h-4 w-4 text-down-foreground" />} items={losers} positive={false} onPick={setSelected} />
      </section>

      {/* Action of the day */}
      <section className="rounded-3xl bg-card soft-shadow p-5 sm:p-7">
        <div className="flex items-center gap-2 mb-4 text-[12px] uppercase tracking-wide font-medium text-muted-foreground">
          <Star className="h-3.5 w-3.5" /> Acțiunea zilei
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[12px] uppercase tracking-wide text-muted-foreground font-medium">{aotd.ticker} · {aotd.sector}</div>
            <div className="text-2xl font-semibold tracking-tight">{aotd.name}</div>
            <div className="mt-2 flex items-baseline gap-3">
              <div className="text-3xl font-semibold tabular-nums">{fmtNum(aotd.price, aotd.price < 1 ? 4 : 2)} <span className="text-base font-medium text-muted-foreground">RON</span></div>
              <div className={cn("inline-flex items-center gap-1 text-[13px] font-medium rounded-full px-2 py-0.5",
                aotdCh >= 0 ? "bg-up/40 text-up-foreground" : "bg-down/40 text-down-foreground")}>
                {fmtPct(aotdCh)}
              </div>
            </div>
            <div className="mt-1 text-[12.5px] text-muted-foreground">Capitalizare: {fmtNum(aotd.mcap)} mld. RON</div>
          </div>
        </div>
        <div className="mt-5">
          <LineCard data={aotdSeries} positive={aotdCh >= 0} height={260} formatter={(v) => v.toFixed(aotd.price < 1 ? 4 : 2)} />
        </div>
      </section>

      {/* Volumes */}
      <section className="rounded-3xl bg-card soft-shadow p-5 sm:p-7">
        <h2 className="text-lg font-semibold tracking-tight">Volume tranzacționate astăzi</h2>
        <p className="mt-1 text-[12.5px] text-muted-foreground">Top 5 acțiuni după volumul tranzacționat (mil. RON).</p>
        <ul className="mt-5 space-y-3">
          {volumes.map((v) => {
            const pct = (v.volume / maxVol) * 100;
            const co = companies.find((c) => c.ticker === v.ticker);
            return (
              <li key={v.ticker} className="grid grid-cols-[80px_1fr_80px] items-center gap-3">
                <div className="text-[13px] font-medium">{v.ticker}</div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-pastel-blue/80" style={{ width: `${pct}%` }} />
                </div>
                <div className="text-right tabular-nums text-[13px] font-medium">
                  {fmtNum(v.volume, 1)} <span className="text-muted-foreground text-[11px]">mil</span>
                </div>
                {co && <div className="col-span-3 -mt-2 text-[11px] text-muted-foreground pl-[80px] -translate-y-1">{co.name}</div>}
              </li>
            );
          })}
        </ul>
      </section>

      {/* All companies */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight">Companii listate</h2>
        </div>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {sectors.map((s) => (
            <button
              key={s}
              onClick={() => setSector(s)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[12px] font-medium transition",
                sector === s ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="rounded-3xl bg-card soft-shadow overflow-hidden">
          <div className="hidden sm:grid grid-cols-[80px_1fr_120px_100px_120px_140px] px-6 py-3 text-[12px] font-medium text-muted-foreground border-b border-border/60">
            <div>Ticker</div>
            <div>Companie</div>
            <SortHeader label="Preț" active={sortKey === "price"} dir={sortDir} onClick={() => toggleSort("price")} />
            <SortHeader label="Variație" active={sortKey === "ch"} dir={sortDir} onClick={() => toggleSort("ch")} />
            <SortHeader label="Cap. (mld)" active={sortKey === "mcap"} dir={sortDir} onClick={() => toggleSort("mcap")} />
            <div className="text-right">Trend</div>
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
          {sorted.length === 0 && (
            <div className="px-6 py-10 text-center text-muted-foreground text-[13px]">Nicio companie în acest sector.</div>
          )}
        </div>
      </section>
    </div>
  );
}

function SortHeader({ label, active, dir, onClick }: { label: string; active: boolean; dir: "asc" | "desc"; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("flex items-center justify-end gap-1 transition", active ? "text-foreground" : "hover:text-foreground")}>
      {label} <ArrowUpDown className={cn("h-3 w-3", active ? "opacity-100" : "opacity-50")} />
      {active && <span className="text-[10px]">{dir === "desc" ? "↓" : "↑"}</span>}
    </button>
  );
}

function TopList({ title, icon, items, positive, onPick }: { title: string; icon: React.ReactNode; items: { ticker: string; name: string; ch: number }[]; positive: boolean; onPick: (t: string) => void }) {
  return (
    <div className="rounded-3xl bg-card soft-shadow p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className={cn("h-7 w-7 rounded-xl flex items-center justify-center", positive ? "bg-up/40" : "bg-down/40")}>{icon}</div>
        <div className="font-medium">{title}</div>
      </div>
      <ul className="divide-y divide-border/50">
        {items.map((it) => (
          <li key={it.ticker}>
            <button onClick={() => onPick(it.ticker)} className="w-full py-2.5 flex items-center justify-between text-left hover:opacity-80 transition">
              <div>
                <div className="text-[13.5px] font-medium">{it.ticker}</div>
                <div className="text-[11.5px] text-muted-foreground">{it.name}</div>
              </div>
              <div className={cn("text-[13px] font-medium tabular-nums", positive ? "text-up-foreground" : "text-down-foreground")}>{fmtPct(it.ch)}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
