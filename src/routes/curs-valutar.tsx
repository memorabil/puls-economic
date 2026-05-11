import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, ArrowLeftRight, Repeat2 } from "lucide-react";
import { fmtNum, fmtPct, pctChange } from "@/lib/format";
import { LineCard } from "@/components/LineCard";
import { Sparkline } from "@/components/Sparkline";
import { Flag } from "@/components/Flag";
import { cn } from "@/lib/utils";
import { Disclaimer } from "@/components/Disclaimer";
import { useBnrToday, useBnrHistory } from "@/lib/use-bnr";
import { CURRENCY_META, PRIMARY_CODES, formatRoDate, seriesForCode } from "@/lib/bnr-utils";

export const Route = createFileRoute("/curs-valutar")({
  head: () => ({
    meta: [
      { title: "Curs valutar BNR — PulsEconomic" },
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

  const today = useBnrToday();
  const yearsNeeded = range === "5A" ? 5 : 1;
  const history = useBnrHistory(yearsNeeded);

  const meta = CURRENCY_META[selected] ?? CURRENCY_META.EUR;
  const rate = today.data?.rates?.[selected];
  const dates = Object.keys(history.data?.series ?? {}).sort();
  const prevDate = dates[dates.length - 2];
  const prev = prevDate ? history.data!.series[prevDate]?.[selected] : undefined;

  const days = ranges.find((r) => r.key === range)!.days;
  const series = useMemo(() => seriesForCode(history.data, selected, days), [history.data, selected, days]);

  const change = rate !== undefined && prev !== undefined ? pctChange(rate, prev) : 0;
  const up = change >= 0;

  const allCodes = today.data?.rates ? Object.keys(today.data.rates) : [...PRIMARY_CODES];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Curs valutar</h1>
        <p className="mt-2 text-muted-foreground text-[15px]">
          Cursul oficial BNR pentru monedele majore — actualizat zilnic{today.data?.date ? ` · ${formatRoDate(today.data.date)}` : ""}.
        </p>
      </header>
      <Disclaimer />

      {/* Selector + chart */}
      <section className="rounded-3xl bg-card soft-shadow p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[13px] text-muted-foreground inline-flex items-center gap-2">
              <Flag iso2={meta.iso2} className="text-base" /> {meta.name}
            </div>
            <div className="mt-1 flex items-baseline gap-3">
              <div className="text-4xl font-semibold tracking-tight tabular-nums">
                {rate !== undefined ? fmtNum(rate, 4) : "—"} <span className="text-base font-medium text-muted-foreground">RON</span>
              </div>
              {rate !== undefined && prev !== undefined && (
                <div className={cn("inline-flex items-center gap-1 text-[13px] font-medium rounded-full px-2 py-0.5", up ? "bg-up/40 text-up-foreground" : "bg-down/40 text-down-foreground")}>
                  {up ? <ArrowUpRight strokeWidth={1.5} className="h-3.5 w-3.5" /> : <ArrowDownRight strokeWidth={1.5} className="h-3.5 w-3.5" />}
                  {fmtPct(change)}
                </div>
              )}
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
          {history.isLoading ? (
            <div className="h-[280px] rounded-2xl bg-muted/40 animate-pulse" />
          ) : series.length > 1 ? (
            <LineCard data={series} positive={up} height={280} formatter={(v) => v.toFixed(4)} />
          ) : (
            <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">Date indisponibile</div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {allCodes.map((code) => {
            const m = CURRENCY_META[code];
            if (!m) return null;
            return (
              <button
                key={code}
                onClick={() => setSelected(code)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[12.5px] font-medium transition inline-flex items-center gap-1.5",
                  selected === code ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Flag iso2={m.iso2} /> {code}
              </button>
            );
          })}
        </div>
        {today.data?.date && (
          <div className="mt-4 text-[11.5px] text-muted-foreground">Sursă: BNR · Actualizat {formatRoDate(today.data.date)}</div>
        )}
      </section>

      <Converter rates={today.data?.rates ?? {}} />

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
          {allCodes.map((code) => {
            const m = CURRENCY_META[code];
            if (!m) return null;
            const r = today.data?.rates?.[code];
            const p = prevDate ? history.data!.series[prevDate]?.[code] : undefined;
            const ch = r !== undefined && p !== undefined ? pctChange(r, p) : 0;
            const u = ch >= 0;
            return (
              <button
                key={code}
                onClick={() => setSelected(code)}
                className="w-full grid grid-cols-2 sm:grid-cols-[1fr_120px_120px_140px] items-center gap-3 px-6 py-4 hover:bg-muted/40 transition border-b border-border/40 last:border-0 text-left"
              >
                <div>
                  <div className="font-medium inline-flex items-center gap-2"><Flag iso2={m.iso2} /> {code}</div>
                  <div className="text-[12px] text-muted-foreground">{m.name}</div>
                </div>
                <div className="text-right tabular-nums font-medium">{r !== undefined ? fmtNum(r, 4) : "—"}</div>
                <div className={cn("text-right text-[13px] font-medium", u ? "text-up-foreground" : "text-down-foreground")}>
                  {ch !== 0 ? fmtPct(ch) : "—"}
                </div>
                <div className="hidden sm:block h-10">
                  <MiniSpark history={history.data} code={code} positive={u} />
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-3 text-[11.5px] text-muted-foreground">
          Sursă: Banca Națională a României{today.data?.date ? ` · ${formatRoDate(today.data.date)}` : ""}.
        </div>
      </section>
    </div>
  );
}

function MiniSpark({ history, code, positive }: { history: any; code: string; positive: boolean }) {
  const data = useMemo(() => seriesForCode(history, code, 30), [history, code]);
  if (data.length < 2) return null;
  return <Sparkline data={data} positive={positive} />;
}

function Converter({ rates }: { rates: Record<string, number> }) {
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("RON");
  const [amount, setAmount] = useState(100);

  const codes = Object.keys(rates);
  const list = ["RON", ...codes].map((code) => ({
    code,
    iso2: code === "RON" ? "ro" : CURRENCY_META[code]?.iso2 ?? "un",
    rate: code === "RON" ? 1 : rates[code] ?? 1,
  }));
  const fromRate = list.find((c) => c.code === from)?.rate ?? 1;
  const toRate = list.find((c) => c.code === to)?.rate ?? 1;
  const result = (amount * fromRate) / toRate;

  return (
    <section className="rounded-3xl bg-pastel-mint/30 p-6 sm:p-8 mx-auto w-full max-w-[640px]">
      <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
        <ArrowLeftRight strokeWidth={1.5} className="h-4 w-4" /> Convertor valutar
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-end gap-4">
        <ConverterField value={amount} onChange={setAmount} currency={from} setCurrency={setFrom} list={list} label="Convertesc" />
        <div className="flex justify-center">
          <button
            onClick={() => { setFrom(to); setTo(from); }}
            className="h-10 w-10 rounded-full bg-card soft-shadow flex items-center justify-center hover:soft-shadow-lg transition"
            aria-label="Inversează monedele"
          >
            <Repeat2 strokeWidth={1.5} className="h-4 w-4" />
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
  list: { code: string; iso2: string }[]; label: string; readOnly?: boolean;
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
            <option key={c.code} value={c.code}>{c.code}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
