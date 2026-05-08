import { currencies, betIndex, rates, inflation } from "@/lib/mock-data";
import { fmtNum, fmtPct, pctChange } from "@/lib/format";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function Ticker() {
  const eur = currencies.find((c) => c.code === "EUR")!;
  const usd = currencies.find((c) => c.code === "USD")!;
  const items = [
    { label: "EUR", value: fmtNum(eur.rate, 4), change: pctChange(eur.rate, eur.prev) },
    { label: "USD", value: fmtNum(usd.rate, 4), change: pctChange(usd.rate, usd.prev) },
    { label: "BET", value: fmtNum(betIndex.value, 0), change: pctChange(betIndex.value, betIndex.prev) },
    { label: "ROBOR 3M", value: `${fmtNum(rates.robor3M)}%`, change: 0.02 },
    { label: "Inflație", value: `${fmtNum(inflation.yearly)}%`, change: -0.1 },
  ];

  return (
    <div className="mt-6 flex gap-4 overflow-x-auto rounded-2xl bg-card/70 backdrop-blur px-4 py-3 soft-shadow [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((it, i) => {
        const up = it.change >= 0;
        return (
          <div key={it.label} className="flex items-center gap-2 whitespace-nowrap text-[12.5px]">
            <span className="font-medium text-muted-foreground">{it.label}</span>
            <span className="font-semibold tabular-nums">{it.value}</span>
            {it.change !== 0 && (
              <span className={cn("inline-flex items-center gap-0.5 font-medium", up ? "text-up-foreground" : "text-down-foreground")}>
                {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {fmtPct(it.change)}
              </span>
            )}
            {i < items.length - 1 && <span className="ml-2 text-muted-foreground/50">·</span>}
          </div>
        );
      })}
    </div>
  );
}
