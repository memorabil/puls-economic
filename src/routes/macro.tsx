import { createFileRoute } from "@tanstack/react-router";
import { MetricCard } from "@/components/MetricCard";

import { Disclaimer } from "@/components/Disclaimer";
import { macro, macroSeries, neighbors, weeklyHighlights } from "@/lib/mock-data";
import { fmtNum } from "@/lib/format";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/macro")({
  head: () => ({
    meta: [
      { title: "Macro & Context — PulsEconomic" },
      { name: "description", content: "PIB, datorie publică, deficit, prețul carburanților, aurului și petrolului. Comparație regională cu Bulgaria, Ungaria și Polonia." },
      { property: "og:title", content: "Macro & Context — PulsEconomic" },
      { property: "og:description", content: "Imaginea de ansamblu a economiei României și comparația cu vecinii." },
    ],
  }),
  component: MacroPage,
});

const macroCards = [
  { key: "gdp", label: "PIB", value: macro.gdp, unit: "mld. €", digits: 1, tone: "blue" as const, vol: 0.03,
    explainer: "Produsul Intern Brut — valoarea totală a tuturor bunurilor și serviciilor produse în România într-un an." },
  { key: "gdpGrowth", label: "Creștere PIB", value: macro.gdpGrowth, unit: "%", tone: "mint" as const, vol: 0.4,
    explainer: "Cu cât crește economia României anual, ajustat pentru inflație." },
  { key: "publicDebt", label: "Datoria publică", value: macro.publicDebt, unit: "% PIB", tone: "lavender" as const, vol: 0.04,
    explainer: "Cât datorează statul român, raportat la mărimea economiei. Sub 60% e considerat sustenabil în UE." },
  { key: "budgetDeficit", label: "Deficit bugetar", value: macro.budgetDeficit, unit: "% PIB", tone: "peach" as const, vol: 0.3,
    explainer: "Cu cât cheltuie statul mai mult decât încasează. UE recomandă maxim -3%." },
  { key: "trade", label: "Balanța comercială", value: macro.tradeBalance, unit: "mld. €", digits: 1, tone: "sand" as const, vol: 0.15,
    explainer: "Diferența între ce exportăm și ce importăm. Negativ = importăm mai mult decât exportăm." },
  { key: "gold", label: "Aur", value: macro.gold, unit: "RON/g", tone: "butter" as const, vol: 0.1,
    explainer: "Prețul unui gram de aur fin, conform cotațiilor BNR." },
];

function MacroPage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Macro &amp; Context</h1>
        <p className="mt-2 text-muted-foreground text-[15px]">Imaginea de ansamblu și comparația cu vecinii.</p>
      </header>
      <Disclaimer />

      <section>
        <h2 className="text-lg font-semibold tracking-tight mb-5">Indicatori macro</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {macroCards.map((m) => (
            <MetricCard
              key={m.key}
              label={m.label}
              value={m.value}
              unit={m.unit}
              digits={m.digits}
              tone={m.tone}
              explainer={m.explainer}
              series={macroSeries(m.key, Math.abs(m.value), m.vol)}
             demo />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight mb-5">Energie &amp; combustibili</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard label="Benzină 95" value={macro.fuel95} unit="RON/l" tone="peach"  demo />
          <MetricCard label="Motorină" value={macro.fuelDiesel} unit="RON/l" tone="lavender"  demo />
          <MetricCard label="Petrol Brent" value={macro.brent} unit="$/baril" digits={1} tone="blue"
            explainer="Prețul de referință pentru petrolul brut la nivel mondial."  demo />
        </div>
      </section>

      <RegionalCompare />

      <WeeklyHighlights />
    </div>
  );
}

function RegionalCompare() {
  const indicators = [
    { key: "inflation" as const, label: "Inflație", lowerBetter: true, suffix: "%" },
    { key: "gdpGrowth" as const, label: "Creștere PIB", lowerBetter: false, suffix: "%" },
    { key: "unemployment" as const, label: "Șomaj", lowerBetter: true, suffix: "%" },
    { key: "debt" as const, label: "Datorie", lowerBetter: true, suffix: "%" },
  ];

  return (
    <section>
      <h2 className="text-lg font-semibold tracking-tight mb-5">Comparație regională</h2>
      <div className="rounded-3xl bg-card soft-shadow overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1.2fr_repeat(4,_1.2fr)] px-6 py-3 text-[12px] font-medium text-muted-foreground border-b border-border/60">
          <div>Țară</div>
          {indicators.map((i) => <div key={i.key} className="text-right pr-2">{i.label}</div>)}
        </div>
        {neighbors.map((n) => (
          <div key={n.country} className="grid grid-cols-1 sm:grid-cols-[1.2fr_repeat(4,_1.2fr)] items-center gap-3 px-6 py-4 border-b border-border/40 last:border-0">
            <div className="font-medium">{n.flag} {n.country}</div>
            {indicators.map((ind) => {
              const max = Math.max(...neighbors.map((x) => x[ind.key]));
              const v = n[ind.key];
              const pct = max > 0 ? (v / max) * 100 : 0;
              return (
                <div key={ind.key} className="space-y-1.5 sm:pr-2">
                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <span className="sm:hidden text-[11.5px] text-muted-foreground">{ind.label}</span>
                    <span className="tabular-nums text-[13px] font-medium">{fmtNum(v, 1)}{ind.suffix}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={cn("h-full rounded-full", ind.lowerBetter ? "bg-pastel-mint" : "bg-pastel-blue")} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11.5px] text-muted-foreground">Bare relative la maximul regional. Verde = mai mic e mai bine, albastru = mai mare e mai bine.</p>
    </section>
  );
}

function WeeklyHighlights() {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-pastel-lavender/30 to-pastel-blue/30 p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-2 text-[13px] font-medium text-muted-foreground">
        <Sparkles className="h-4 w-4" /> Săptămâna asta
      </div>
      <h2 className="text-xl font-semibold tracking-tight">Cele 3 cifre care contează</h2>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {weeklyHighlights.map((h) => (
          <div key={h.title} className="rounded-2xl bg-card soft-shadow p-5">
            <div className="text-[12px] text-muted-foreground font-medium">{h.title}</div>
            <div className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">{h.value}</div>
            <p className="mt-2 text-[12.5px] text-muted-foreground leading-relaxed">{h.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
