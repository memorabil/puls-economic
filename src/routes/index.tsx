import { createFileRoute, Link } from "@tanstack/react-router";
import { MetricCard } from "@/components/MetricCard";
import { Ticker } from "@/components/Ticker";
import { Disclaimer } from "@/components/Disclaimer";
import { betIndex, currencies, fxSeries, indicatorSeries, inflation, rates } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PulsEconomic — Economia României în timp real" },
      { name: "description", content: "Curs valutar BNR, BET, ROBOR, IRCC și inflația — pulsul economiei României, pe înțelesul tuturor." },
      { property: "og:title", content: "PulsEconomic — Economia României în timp real" },
      { property: "og:description", content: "Pulsul economiei României, pe înțelesul tuturor." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const eur = currencies.find((c) => c.code === "EUR")!;
  const usd = currencies.find((c) => c.code === "USD")!;
  const gbp = currencies.find((c) => c.code === "GBP")!;
  const chf = currencies.find((c) => c.code === "CHF")!;

  // Determine economic mood from rough volatility of headline indicators
  const eurCh = Math.abs((eur.rate - eur.prev) / eur.prev) * 100;
  const usdCh = Math.abs((usd.rate - usd.prev) / usd.prev) * 100;
  const avgVol = (eurCh + usdCh) / 2;
  const mood = avgVol < 0.4 ? { color: "bg-up/60", label: "Stabil" } :
               avgVol < 0.8 ? { color: "bg-pastel-butter", label: "Atenție" } :
                              { color: "bg-down/60", label: "Volatil" };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Hero — compact */}
      <section className="rounded-3xl bg-gradient-to-br from-pastel-blue/40 via-pastel-lavender/30 to-pastel-mint/40 p-6 sm:p-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-card/70 px-3 py-1 text-[12px] font-medium text-foreground/80 soft-shadow">
            <span className="h-1.5 w-1.5 rounded-full bg-up-foreground animate-pulse" />
            Date actualizate astăzi
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            PulsEconomic <span className="text-foreground/50">— economia României, în timp real,</span> <span className="text-foreground/60">pe înțelesul tuturor.</span>
          </h1>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/curs-valutar" className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition">
              Vezi cursul valutar <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/bursa" className="inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-medium soft-shadow hover:soft-shadow-lg transition">
              Bursa BVB
            </Link>
          </div>
        </div>
        <Ticker />
      </section>

      <Disclaimer />

      {/* Currencies */}
      <section>
        <SectionHeader title="Curs valutar BNR" subtitle="Cele mai urmărite monede — evoluția pe 30 de zile" linkTo="/curs-valutar" linkText="Toate monedele" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[eur, usd, gbp, chf].map((c, i) => (
            <MetricCard
              key={c.code}
              label={`1 ${c.code} = RON`}
              value={c.rate}
              prev={c.prev}
              current={c.rate}
              digits={4}
              series={fxSeries(c.code, 30)}
              tone={(["blue", "mint", "peach", "lavender"] as const)[i]}
              explainer={`Cât costă 1 ${c.name} (${c.code}) în lei, conform cursului oficial BNR.`}
            />
          ))}
        </div>
      </section>

      {/* Markets / rates */}
      <section>
        <SectionHeader title="Pulsul economiei" subtitle="Indicatorii cheie de astăzi" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard label="Indicele BET" value={betIndex.value} prev={betIndex.prev} current={betIndex.value}
            digits={2} series={betIndex.series} tone="butter"
            explainer="Indicele principal al Bursei de Valori București — măsoară evoluția celor mai mari companii românești listate." />
          <MetricCard label="ROBOR 3M" value={rates.robor3M} unit="%" tone="lavender"
            series={indicatorSeries("robor3m", rates.robor3M, 0.012)}
            explainer="Rata medie a dobânzii la care băncile românești se împrumută între ele pe 3 luni. Influențează direct dobânzile la creditele cu rată variabilă." />
          <MetricCard label="Dobânda BNR" value={rates.bnrPolicy} unit="%" tone="mint"
            series={indicatorSeries("bnr", rates.bnrPolicy, 0.005)}
            explainer="Dobânda de politică monetară a Băncii Naționale — instrumentul principal pentru controlul inflației." />
          <MetricCard label="Inflație anuală" value={inflation.yearly} unit="%" tone="peach" series={inflation.series}
            explainer="Cu cât au crescut prețurile în ultimele 12 luni. Cu cât e mai mare, cu atât banii tăi cumpără mai puțin." />
          <MetricCard label="Inflație lunară" value={inflation.monthly} unit="%" tone="sand"
            series={indicatorSeries("infl-m", inflation.monthly, 0.05)}
            explainer="Variația prețurilor față de luna trecută." />
          <MetricCard label="IRCC" value={rates.ircc} unit="%" tone="blue"
            series={indicatorSeries("ircc", rates.ircc, 0.008)}
            explainer="Indicele de Referință pentru Creditele Consumatorilor — alternativă la ROBOR pentru creditele noi în lei." />
        </div>
      </section>

      {/* Quick takeaway */}
      <section className="rounded-3xl bg-card soft-shadow p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold tracking-tight">Ce înseamnă astăzi pentru tine?</h3>
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11.5px] font-medium", mood.color)}>
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" /> {mood.label}
            </span>
          </div>
          <p className="mt-3 text-[14.5px] text-muted-foreground leading-relaxed">
            Inflația continuă să scadă lent spre ținta BNR. Leul s-a depreciat ușor față de euro, dar rămâne stabil. Dobânzile la lei sunt încă ridicate — bun pentru economii, mai puțin pentru credite noi.
          </p>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, subtitle, linkTo, linkText }: { title: string; subtitle: string; linkTo?: string; linkText?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">{subtitle}</p>
      </div>
      {linkTo && (
        <Link to={linkTo} className="text-[13px] font-medium text-foreground/70 hover:text-foreground inline-flex items-center gap-1">
          {linkText} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
