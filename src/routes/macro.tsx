import { createFileRoute } from "@tanstack/react-router";
import { MetricCard } from "@/components/MetricCard";
import { macro, neighbors } from "@/lib/mock-data";
import { fmtNum } from "@/lib/format";

export const Route = createFileRoute("/macro")({
  head: () => ({
    meta: [
      { title: "Macro & Context — Economia României" },
      { name: "description", content: "PIB, datorie publică, deficit, prețul carburanților, aurului și petrolului. Comparație regională." },
    ],
  }),
  component: MacroPage,
});

function MacroPage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Macro & Context</h1>
        <p className="mt-2 text-muted-foreground text-[15px]">Imaginea de ansamblu și comparația cu vecinii.</p>
      </header>

      <section>
        <h2 className="text-lg font-semibold tracking-tight mb-5">Indicatori macro</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard label="PIB" value={macro.gdp} unit="mld. €" digits={1} tone="blue"
            explainer="Produsul Intern Brut — valoarea totală a tuturor bunurilor și serviciilor produse în România într-un an." />
          <MetricCard label="Creștere PIB" value={macro.gdpGrowth} unit="%" tone="mint"
            explainer="Cu cât crește economia României anual, ajustat pentru inflație." />
          <MetricCard label="Datoria publică" value={macro.publicDebt} unit="% PIB" tone="lavender"
            explainer="Cât datorează statul român, raportat la mărimea economiei. Sub 60% e considerat sustenabil în UE." />
          <MetricCard label="Deficit bugetar" value={macro.budgetDeficit} unit="% PIB" tone="peach"
            explainer="Cu cât cheltuie statul mai mult decât încasează. UE recomandă maxim -3%." />
          <MetricCard label="Balanța comercială" value={macro.tradeBalance} unit="mld. €" digits={1} tone="sand"
            explainer="Diferența între ce exportăm și ce importăm. Negativ = importăm mai mult decât exportăm." />
          <MetricCard label="Aur" value={macro.gold} unit="RON/g" tone="butter"
            explainer="Prețul unui gram de aur fin, conform cotațiilor BNR." />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight mb-5">Energie & combustibili</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard label="Benzină 95" value={macro.fuel95} unit="RON/l" tone="peach" />
          <MetricCard label="Motorină" value={macro.fuelDiesel} unit="RON/l" tone="lavender" />
          <MetricCard label="Petrol Brent" value={macro.brent} unit="$/baril" digits={1} tone="blue"
            explainer="Prețul de referință pentru petrolul brut la nivel mondial." />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight mb-5">Comparație regională</h2>
        <div className="rounded-3xl bg-card soft-shadow overflow-hidden">
          <div className="grid grid-cols-[1.2fr_repeat(4,_1fr)] px-6 py-3 text-[12px] font-medium text-muted-foreground border-b border-border/60">
            <div>Țară</div>
            <div className="text-right">Inflație</div>
            <div className="text-right">Creștere PIB</div>
            <div className="text-right">Șomaj</div>
            <div className="text-right">Datorie</div>
          </div>
          {neighbors.map((n) => (
            <div key={n.country} className="grid grid-cols-[1.2fr_repeat(4,_1fr)] items-center px-6 py-4 border-b border-border/40 last:border-0">
              <div className="font-medium">{n.flag} {n.country}</div>
              <div className="text-right tabular-nums">{fmtNum(n.inflation, 1)}%</div>
              <div className="text-right tabular-nums">{fmtNum(n.gdpGrowth, 1)}%</div>
              <div className="text-right tabular-nums">{fmtNum(n.unemployment, 1)}%</div>
              <div className="text-right tabular-nums">{fmtNum(n.debt, 1)}%</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
