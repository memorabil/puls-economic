import { createFileRoute } from "@tanstack/react-router";
import { MetricCard } from "@/components/MetricCard";
import { LineCard } from "@/components/LineCard";
import { inflation, labor, rates } from "@/lib/mock-data";
import { fmtNum } from "@/lib/format";

export const Route = createFileRoute("/dobanzi")({
  head: () => ({
    meta: [
      { title: "Dobânzi & Inflație — Economia României" },
      { name: "description", content: "ROBOR, IRCC, dobânda BNR, inflație, randamente titluri de stat și piața muncii." },
    ],
  }),
  component: DobanziPage,
});

function DobanziPage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Dobânzi & Inflație</h1>
        <p className="mt-2 text-muted-foreground text-[15px]">Cât costă banii în România și cu cât cresc prețurile.</p>
      </header>

      <section>
        <h2 className="text-lg font-semibold tracking-tight mb-5">Dobânzi de referință</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard label="Dobânda BNR" value={rates.bnrPolicy} unit="%" tone="mint"
            explainer="Dobânda de politică monetară — instrumentul principal al BNR pentru a controla inflația. Influențează toate dobânzile din economie." />
          <MetricCard label="ROBOR 3M" value={rates.robor3M} unit="%" tone="blue"
            explainer="Dobânda la care băncile se împrumută între ele pe 3 luni. Este folosită pentru calculul ratelor la unele credite mai vechi." />
          <MetricCard label="ROBOR 6M" value={rates.robor6M} unit="%" tone="lavender" />
          <MetricCard label="ROBOR 12M" value={rates.robor12M} unit="%" tone="peach" />
          <MetricCard label="IRCC" value={rates.ircc} unit="%" tone="butter"
            explainer="Indicele de Referință pentru Creditele Consumatorilor — folosit pentru creditele noi în lei. Se actualizează trimestrial." />
          <MetricCard label="Titluri stat 10 ani" value={rates.bond10y} unit="%" tone="sand"
            explainer="Randamentul la care statul român se împrumută pe 10 ani. Reflectă încrederea investitorilor în economia României." />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        <div className="rounded-3xl bg-card soft-shadow p-6">
          <div className="flex items-end justify-between gap-3 mb-5">
            <div>
              <div className="text-[13px] text-muted-foreground">Inflație anuală (IPC)</div>
              <div className="text-4xl font-semibold tracking-tight tabular-nums">{fmtNum(inflation.yearly)}<span className="text-lg text-muted-foreground ml-1">%</span></div>
            </div>
            <div className="text-right text-[12px] text-muted-foreground">Ultimele 12 luni</div>
          </div>
          <LineCard data={inflation.series} labels={inflation.labels} positive={false} height={220} formatter={(v) => `${v.toFixed(1)}%`} />
          <p className="mt-4 text-[13px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Ce înseamnă pentru tine?</strong> Cu o inflație de {fmtNum(inflation.yearly)}%, ce ai cumpărat acum un an cu 100 lei costă acum {fmtNum(100 * (1 + inflation.yearly / 100), 0)} lei. Banii din cont își pierd din putere dacă nu sunt investiți.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <MetricCard label="Inflație lunară" value={inflation.monthly} unit="%" tone="peach"
            explainer="Cu cât au crescut prețurile față de luna precedentă." />
          <MetricCard label="Rata șomajului" value={labor.unemployment} unit="%" tone="lavender"
            explainer="Procentul populației active care caută activ un loc de muncă." />
          <MetricCard label="Salariu mediu net" value={labor.avgNetSalary} unit="RON" digits={0} tone="mint"
            explainer="Salariul mediu net pe economie, conform INS." />
        </div>
      </section>
    </div>
  );
}
