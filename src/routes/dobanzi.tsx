import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { LineCard } from "@/components/LineCard";
import { Disclaimer } from "@/components/Disclaimer";
import { deposits, inflation, labor, rates } from "@/lib/mock-data";
import { fmtNum } from "@/lib/format";
import { Calculator, PiggyBank, Landmark, Percent, LineChart, Receipt, Flame, Activity, Users, Wallet, Info } from "lucide-react";
import { useBnrIndicators } from "@/lib/use-bnr-indicators";

export const Route = createFileRoute("/dobanzi")({
  head: () => ({
    meta: [
      { title: "Dobânzi & Inflație — PulsEconomic" },
      { name: "description", content: "ROBOR, IRCC, dobânda BNR, inflație, randamente titluri de stat și piața muncii." },
      { property: "og:title", content: "Dobânzi & Inflație — PulsEconomic" },
      { property: "og:description", content: "Cât costă banii în România. ROBOR, IRCC, BNR, inflație, calculator credit." },
    ],
  }),
  component: DobanziPage,
});

function monthlyRate(principal: number, annualPct: number, years: number) {
  const r = annualPct / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

function DobanziPage() {
  const ind = useBnrIndicators();
  const v = ind.data?.values ?? {};
  const live = (k: keyof typeof v, fallback: number) => (v[k] ?? fallback);
  const isLive = (k: keyof typeof v) => v[k] !== undefined;
  const src = ind.data?.asOf ? `BNR · ${ind.data.asOf}` : ind.data?.error ? "BNR · sursă indisponibilă" : undefined;
  const stale = !!ind.data?.error || (!ind.isLoading && !ind.data?.asOf);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Dobânzi &amp; Inflație</h1>
        <p className="mt-2 text-muted-foreground text-[15px]">Cât costă banii în România și cu cât cresc prețurile.</p>
      </header>
      <Disclaimer />

      <section>
        <h2 className="text-lg font-semibold tracking-tight mb-5">Dobânzi de referință</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard label="Dobânda BNR" value={live("bnrPolicy", rates.bnrPolicy)} unit="%" tone="mint" icon={Landmark}
            explainer="Dobânda de politică monetară — instrumentul principal al BNR pentru a controla inflația. Influențează toate dobânzile din economie."
            source={isLive("bnrPolicy") ? src : undefined} stale={stale} loading={ind.isLoading} demo={!isLive("bnrPolicy")} />
          <MetricCard label="ROBOR 3M" value={live("robor3M", rates.robor3M)} unit="%" tone="lavender" icon={Percent}
            explainer="Rata medie a dobânzii la care băncile românești se împrumută între ele pe 3 luni. Influențează direct dobânzile la creditele cu rată variabilă."
            source={isLive("robor3M") ? src : undefined} stale={stale} loading={ind.isLoading} demo={!isLive("robor3M")} />
          <MetricCard label="ROBOR 6M" value={live("robor6M", rates.robor6M)} unit="%" tone="lavender" icon={Percent}
            source={isLive("robor6M") ? src : undefined} stale={stale} loading={ind.isLoading} demo={!isLive("robor6M")} />
          <MetricCard label="ROBOR 12M" value={live("robor12M", rates.robor12M)} unit="%" tone="lavender" icon={Percent}
            source={isLive("robor12M") ? src : undefined} stale={stale} loading={ind.isLoading} demo={!isLive("robor12M")} />
          <MetricCard label="IRCC" value={live("ircc", rates.ircc)} unit="%" tone="blue" icon={LineChart}
            explainer="Indicele de Referință pentru Creditele Consumatorilor — folosit pentru creditele noi în lei. Se actualizează trimestrial."
            source={isLive("ircc") ? src : undefined} stale={stale} loading={ind.isLoading} demo={!isLive("ircc")} />
          <MetricCard label="Titluri stat 10 ani" value={rates.bond10y} unit="%" tone="sand" icon={Receipt}
            explainer="Randamentul la care statul român se împrumută pe 10 ani. Reflectă încrederea investitorilor în economia României."  demo />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        <div className="rounded-3xl bg-card soft-shadow p-6">
          <div className="flex items-end justify-between gap-3 mb-5">
            <div className="flex items-start gap-2.5">
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-pastel-peach/40 mt-1">
                <Flame strokeWidth={1.5} className="h-5 w-5 text-[oklch(0.5_0.1_30)]" />
              </div>
              <div>
              <div className="text-[13px] text-muted-foreground">Inflație anuală (IPC)</div>
              <div className="text-4xl font-semibold tracking-tight tabular-nums">{fmtNum(inflation.yearly)}<span className="text-lg text-muted-foreground ml-1">%</span></div>
              </div>
            </div>
            <div className="text-right text-[12px] text-muted-foreground">Ultimele 12 luni</div>
          </div>
          <LineCard data={inflation.series} labels={inflation.labels} positive={false} height={220} formatter={(v) => `${v.toFixed(1)}%`} />
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-pastel-butter/30 p-3.5">
            <div className="h-7 w-7 rounded-full flex items-center justify-center bg-pastel-butter/60 shrink-0">
              <Info strokeWidth={1.5} className="h-4 w-4 text-[oklch(0.5_0.09_85)]" />
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Ce înseamnă pentru tine?</strong> Cu o inflație de {fmtNum(inflation.yearly)}%, ce ai cumpărat acum un an cu 100 lei costă acum {fmtNum(100 * (1 + inflation.yearly / 100), 0)} lei. Banii din cont își pierd din putere dacă nu sunt investiți.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <MetricCard label="Inflație lunară" value={inflation.monthly} unit="%" tone="peach" icon={Activity}
            explainer="Cu cât au crescut prețurile față de luna precedentă."  demo />
          <MetricCard label="Rata șomajului" value={labor.unemployment} unit="%" tone="lavender" icon={Users}
            explainer="Procentul populației active care caută activ un loc de muncă."  demo />
          <MetricCard label="Salariu mediu net" value={labor.avgNetSalary} unit="RON" digits={0} tone="mint" icon={Wallet}
            explainer="Salariul mediu net pe economie, conform INS."  demo />
        </div>
      </section>

      <CreditCalculator />

      <DepositRates />
    </div>
  );
}

function CreditCalculator() {
  const [amount, setAmount] = useState(200000);
  const [years, setYears] = useState(25);
  const [base, setBase] = useState<"IRCC" | "ROBOR">("IRCC");
  const margin = 2;
  const baseRate = base === "IRCC" ? rates.ircc : rates.robor3M;
  const total = baseRate + margin;
  const monthly = monthlyRate(amount, total, years);

  return (
    <section className="rounded-3xl bg-pastel-blue/25 p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-2 text-[13px] font-medium text-muted-foreground">
        <Calculator className="h-4 w-4" /> Calculator credit rapid
      </div>
      <h2 className="text-xl font-semibold tracking-tight">Cât ar fi rata mea lunară?</h2>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-card soft-shadow p-4">
          <label className="text-[11.5px] uppercase tracking-wide text-muted-foreground font-medium" htmlFor="cc-amount">Sumă (RON)</label>
          <input id="cc-amount" type="number" min={0} value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="mt-2 w-full bg-transparent text-2xl font-semibold tabular-nums focus:outline-none" />
        </div>
        <div className="rounded-2xl bg-card soft-shadow p-4">
          <label className="text-[11.5px] uppercase tracking-wide text-muted-foreground font-medium" htmlFor="cc-years">Perioadă (ani)</label>
          <input id="cc-years" type="number" min={1} max={30} value={years} onChange={(e) => setYears(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
            className="mt-2 w-full bg-transparent text-2xl font-semibold tabular-nums focus:outline-none" />
        </div>
        <div className="rounded-2xl bg-card soft-shadow p-4">
          <div className="text-[11.5px] uppercase tracking-wide text-muted-foreground font-medium">Indice de referință</div>
          <div className="mt-2 flex gap-1.5">
            {(["IRCC", "ROBOR"] as const).map((k) => (
              <button key={k} onClick={() => setBase(k)}
                className={`px-3 py-1.5 rounded-full text-[12.5px] font-medium transition ${base === k ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}>
                {k}
              </button>
            ))}
          </div>
          <div className="mt-2 text-[11.5px] text-muted-foreground">{base} {fmtNum(baseRate)}% + marjă bancă {margin}% = <span className="text-foreground font-medium">{fmtNum(total)}%</span></div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-card soft-shadow p-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[12px] text-muted-foreground">Rată lunară estimată</div>
          <div className="mt-1 text-4xl font-semibold tabular-nums">{fmtNum(monthly, 0)} <span className="text-base font-medium text-muted-foreground">RON / lună</span></div>
        </div>
        <div className="text-right text-[12px] text-muted-foreground">
          <div>Total dobândă: <span className="text-foreground font-medium">{fmtNum(monthly * years * 12 - amount, 0)} RON</span></div>
          <div>Total de plată: <span className="text-foreground font-medium">{fmtNum(monthly * years * 12, 0)} RON</span></div>
        </div>
      </div>
      <p className="mt-3 text-[11.5px] text-muted-foreground">Calcul orientativ — dobânda finală depinde de banca aleasă.</p>
    </section>
  );
}

function DepositRates() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4 text-[13px] font-medium text-muted-foreground">
        <PiggyBank className="h-4 w-4" /> Dobânzi la depozite
      </div>
      <div className="rounded-3xl bg-card soft-shadow overflow-hidden">
        <div className="grid grid-cols-3 px-6 py-3 text-[12px] font-medium text-muted-foreground border-b border-border/60">
          <div>Termen</div>
          <div className="text-right">RON</div>
          <div className="text-right">EUR</div>
        </div>
        {deposits.map((d) => (
          <div key={d.term} className="grid grid-cols-3 items-center px-6 py-4 border-b border-border/40 last:border-0">
            <div className="font-medium">{d.term}</div>
            <div className="text-right tabular-nums font-medium">{fmtNum(d.ron)}%</div>
            <div className="text-right tabular-nums text-muted-foreground">{fmtNum(d.eur)}%</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11.5px] text-muted-foreground">Medii orientative — dobânzile reale variază între bănci.</p>
    </section>
  );
}
