import { createFileRoute, Link } from "@tanstack/react-router";
import { MetricCard } from "@/components/MetricCard";
import { Ticker } from "@/components/Ticker";
import { Disclaimer } from "@/components/Disclaimer";
import { Flag } from "@/components/Flag";
import { betIndex, indicatorSeries, inflation, rates } from "@/lib/mock-data";
import { ArrowRight, BarChart3, TrendingUp, Percent, Landmark, Flame, Activity, LineChart as LineChartIcon, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBnrToday, useBnrHistory } from "@/lib/use-bnr";
import { CURRENCY_META, formatRoDate, seriesForCode } from "@/lib/bnr-utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PulsEconomic — Economia României în timp real" },
      { name: "description", content: "Curs valutar BNR, BET, ROBOR, IRCC și inflația — pulsul economiei României, pe înțelesul tuturor." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const today = useBnrToday();
  const history = useBnrHistory(1);

  const rates_ = today.data?.rates ?? {};
  const dates = Object.keys(history.data?.series ?? {}).sort();
  const yesterdayKey = dates[dates.length - 2];
  const yesterday = yesterdayKey ? history.data!.series[yesterdayKey] : {};

  const codes = ["EUR", "USD", "GBP", "CHF"] as const;
  const tones = ["blue", "mint", "peach", "lavender"] as const;

  // Mood from EUR/USD volatility
  const eur = rates_["EUR"];
  const usd = rates_["USD"];
  const eurPrev = yesterday["EUR"];
  const usdPrev = yesterday["USD"];
  const avgVol = eur && eurPrev && usd && usdPrev
    ? (Math.abs((eur - eurPrev) / eurPrev) + Math.abs((usd - usdPrev) / usdPrev)) * 50
    : 0.3;
  const mood = avgVol < 0.4 ? { color: "bg-up/60", label: "Stabil" } :
               avgVol < 0.8 ? { color: "bg-pastel-butter", label: "Atenție" } :
                              { color: "bg-down/60", label: "Volatil" };

  const dateLabel = today.data?.date ? `Curs BNR · ${formatRoDate(today.data.date)}` : "Curs BNR · se încarcă…";
  const sourceLine = today.data?.date ? `Sursă: BNR · Actualizat ${formatRoDate(today.data.date)}` : undefined;
  const isLoading = today.isLoading || history.isLoading;

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="rounded-3xl bg-gradient-to-br from-pastel-blue/40 via-pastel-lavender/30 to-pastel-mint/40 p-6 sm:p-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-card/70 px-3 py-1 text-[12px] font-medium text-foreground/80 soft-shadow">
            <span className="h-1.5 w-1.5 rounded-full bg-up-foreground animate-pulse" />
            {dateLabel}
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            PulsEconomic <span className="text-foreground/50">— economia României, în timp real,</span> <span className="text-foreground/60">pe înțelesul tuturor.</span>
          </h1>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/curs-valutar" className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition">
              Vezi cursul valutar <ArrowRight strokeWidth={1.5} className="h-4 w-4" />
            </Link>
            <Link to="/bursa" className="inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-medium soft-shadow hover:soft-shadow-lg transition">
              <BarChart3 strokeWidth={1.5} className="h-4 w-4" /> Bursa BVB
            </Link>
          </div>
        </div>
        <Ticker />
      </section>

      <Disclaimer />

      <section>
        <SectionHeader title="Curs valutar BNR" subtitle="Cele mai urmărite monede — evoluția pe 30 de zile" linkTo="/curs-valutar" linkText="Toate monedele" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {codes.map((code, i) => {
            const meta = CURRENCY_META[code];
            const rate = rates_[code];
            const prev = yesterday[code];
            const series = seriesForCode(history.data, code, 30);
            return (
              <MetricCard
                key={code}
                label={`1 ${code} = RON`}
                value={rate ?? "—"}
                prev={prev}
                current={rate}
                digits={4}
                series={series.length > 1 ? series : undefined}
                tone={tones[i]}
                explainer={`Cât costă 1 ${meta.name} (${code}) în lei, conform cursului oficial BNR.`}
                leading={<Flag iso2={meta.iso2} className="text-base" />}
                source={sourceLine}
                loading={isLoading && rate === undefined}
                stale={!today.isLoading && !today.data?.date}
              />
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeader title="Pulsul economiei" subtitle="Indicatorii cheie de astăzi" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard label="Indicele BET" value={betIndex.value} prev={betIndex.prev} current={betIndex.value}
            digits={2} series={betIndex.series} tone="butter" icon={TrendingUp} demo
            explainer="Indicele principal al Bursei de Valori București." />
          <MetricCard label="ROBOR 3M" value={rates.robor3M} unit="%" tone="lavender" icon={Percent} demo
            series={indicatorSeries("robor3m", rates.robor3M, 0.012)} />
          <MetricCard label="Dobânda BNR" value={rates.bnrPolicy} unit="%" tone="mint" icon={Landmark} demo
            series={indicatorSeries("bnr", rates.bnrPolicy, 0.005)} />
          <MetricCard label="Inflație anuală" value={inflation.yearly} unit="%" tone="peach" series={inflation.series} icon={Flame} demo />
          <MetricCard label="Inflație lunară" value={inflation.monthly} unit="%" tone="sand" icon={Activity} demo
            series={indicatorSeries("infl-m", inflation.monthly, 0.05)} />
          <MetricCard label="IRCC" value={rates.ircc} unit="%" tone="blue" icon={LineChartIcon} demo
            series={indicatorSeries("ircc", rates.ircc, 0.008)} />
        </div>
      </section>

      <section className="rounded-3xl bg-card soft-shadow p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
        <div className="h-10 w-10 rounded-full bg-pastel-butter/40 flex items-center justify-center shrink-0">
          <Lightbulb strokeWidth={1.5} className="h-5 w-5 text-[oklch(0.5_0.09_85)]" />
        </div>
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
          {linkText} <ArrowRight strokeWidth={1.5} className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
