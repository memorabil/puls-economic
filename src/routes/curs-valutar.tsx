import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, ArrowLeftRight } from "lucide-react";
import { currencies, fxSeries } from "@/lib/mock-data";
import { fmtNum, fmtPct, pctChange } from "@/lib/format";
import { LineCard } from "@/components/LineCard";
import { Sparkline } from "@/components/Sparkline";
import { cn } from "@/lib/utils";
import { Disclaimer } from "@/components/Disclaimer";

export const Route = createFileRoute("/curs-valutar")({
  head: () => ({
    meta: [
      { title: "Curs valutar BNR — Economia României" },
      { name: "description", content: "Cursul oficial BNR pentru toate monedele majore. Convertor și grafice de evoluție." },
    ],
  }),
  component: CursPage,
});

const ranges = [
  { key: "1L", days: 30 },
  { key: "6L", days: 180 },
  { key: "1A", days: 365 },
  { key: "5A", days: 365 * 5 },
] as const;

function CursPage() {
  const [selected, setSelected] = useState("EUR");
  const [range, setRange] = useState<(typeof ranges)[number]["key"]>("1L");

  const cur = currencies.find((c) => c.code === selected)!;
  const days = ranges.find((r) => r.key === range)!.days;
  const series = useMemo(() => fxSeries(selected, Math.min(days, 365)), [selected, days]);

  const change = pctChange(cur.rate, cur.prev);
  const up = change >= 0;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Curs valutar</h1>
        <p className="mt-2 text-muted-foreground text-[15px]">Cursul oficial BNR pentru monedele majore — actualizat zilnic.</p>
      </header>
      <Disclaimer />

      {/* Selector + chart */}
      <section className="rounded-3xl bg-card soft-shadow p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[13px] text-muted-foreground">{cur.flag} {cur.name}</div>
            <div className="mt-1 flex items-baseline gap-3">
              <div className="text-4xl font-semibold tracking-tight tabular-nums">{fmtNum(cur.rate, 4)} <span className="text-base font-medium text-muted-foreground">RON</span></div>
              <div className={cn("inline-flex items-center gap-1 text-[13px] font-medium rounded-full px-2 py-0.5", up ? "bg-up/40 text-up-foreground" : "bg-down/40 text-down-foreground")}>
                {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {fmtPct(change)}
              </div>
            </div>
          </div>
          <div className="flex gap-1 rounded-full bg-muted p-1">
            {ranges.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={cn(
                  "px-3.5 py-1.5 text-[12.5px] font-medium rounded-full transition",
                  range === r.key ? "bg-card text-foreground soft-shadow" : "text-muted-foreground"
                )}
              >
                {r.key}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <LineCard data={series} positive={up} height={280} formatter={(v) => v.toFixed(4)} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => setSelected(c.code)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[12.5px] font-medium transition",
                selected === c.code ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {c.flag} {c.code}
            </button>
          ))}
        </div>
      </section>

      <Converter />

      {/* All currencies */}
      <section>
        <h2 className="text-xl font-semibold tracking-tight mb-5">Toate monedele</h2>
        <div className="rounded-3xl bg-card soft-shadow overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_120px_120px_140px] px-6 py-3 text-[12px] font-medium text-muted-foreground border-b border-border/60">
            <div>Monedă</div>
            <div className="text-right">Curs RON</div>
            <div className="text-right">Variație</div>
            <div className="text-right">Trend (30z)</div>
          </div>
          {currencies.map((c) => {
            const ch = pctChange(c.rate, c.prev);
            const u = ch >= 0;
            return (
              <button
                key={c.code}
                onClick={() => setSelected(c.code)}
                className="w-full grid grid-cols-2 sm:grid-cols-[1fr_120px_120px_140px] items-center gap-3 px-6 py-4 hover:bg-muted/40 transition border-b border-border/40 last:border-0 text-left"
              >
                <div>
                  <div className="font-medium">{c.flag} {c.code}</div>
                  <div className="text-[12px] text-muted-foreground">{c.name}</div>
                </div>
                <div className="text-right tabular-nums font-medium">{fmtNum(c.rate, 4)}</div>
                <div className={cn("text-right text-[13px] font-medium", u ? "text-up-foreground" : "text-down-foreground")}>
                  {fmtPct(ch)}
                </div>
                <div className="hidden sm:block h-10">
                  <MiniSpark code={c.code} positive={u} />
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-3 text-[11.5px] text-muted-foreground">Sursă: Banca Națională a României (orientativ).</div>
      </section>
    </div>
  );
}

function MiniSpark({ code, positive }: { code: string; positive: boolean }) {
  const data = useMemo(() => fxSeries(code, 30), [code]);
  return <Sparkline data={data} positive={positive} />;
}

function Converter() {
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("RON");
  const [amount, setAmount] = useState(100);

  const list = [{ code: "RON", name: "Leu românesc", flag: "🇷🇴", rate: 1, prev: 1, region: "România" }, ...currencies];
  const fromRate = list.find((c) => c.code === from)!.rate;
  const toRate = list.find((c) => c.code === to)!.rate;
  // amount in RON = amount * fromRate; converted = / toRate
  const result = (amount * fromRate) / toRate;

  return (
    <section className="rounded-3xl bg-pastel-mint/30 p-6 sm:p-8 mx-auto w-full max-w-[640px]">
      <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
        <ArrowLeftRight className="h-4 w-4" /> Convertor valutar
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-end gap-4">
        <ConverterField value={amount} onChange={setAmount} currency={from} setCurrency={setFrom} list={list} label="Convertesc" />
        <div className="flex justify-center">
          <button
            onClick={() => { setFrom(to); setTo(from); }}
            className="h-10 w-10 rounded-full bg-card soft-shadow flex items-center justify-center hover:soft-shadow-lg transition"
            aria-label="Inversează monedele"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        </div>
        <ConverterField value={result} onChange={() => {}} currency={to} setCurrency={setTo} list={list} label="În" readOnly />
      </div>
      <p className="mt-4 text-[11.5px] text-muted-foreground text-center">Calculat la cursul oficial BNR de astăzi.</p>
    </section>
  );
}

function ConverterField({
  value, onChange, currency, setCurrency, list, label, readOnly,
}: {
  value: number; onChange: (n: number) => void; currency: string; setCurrency: (c: string) => void;
  list: { code: string; flag: string }[]; label: string; readOnly?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-card soft-shadow p-4">
      <div className="text-[11.5px] uppercase tracking-wide text-muted-foreground font-medium">{label}</div>
      <div className="mt-2 flex items-center gap-3">
        <input
          type="number"
          value={readOnly ? value.toFixed(2) : value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          readOnly={readOnly}
          className="flex-1 bg-transparent text-2xl font-semibold tabular-nums focus:outline-none w-full"
        />
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium focus:outline-none"
        >
          {list.map((c) => (
            <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
