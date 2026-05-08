import { Info, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sparkline } from "./Sparkline";
import { fmtNum, fmtPct, pctChange } from "@/lib/format";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: number | string;
  prev?: number;
  current?: number;
  unit?: string;
  digits?: number;
  series?: number[];
  tone?: "blue" | "mint" | "peach" | "lavender" | "butter" | "sand" | "rose";
  explainer?: string;
  size?: "sm" | "md" | "lg";
}

const toneBg: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  blue: "bg-pastel-blue/40",
  mint: "bg-pastel-mint/40",
  peach: "bg-pastel-peach/40",
  lavender: "bg-pastel-lavender/40",
  butter: "bg-pastel-butter/40",
  sand: "bg-pastel-sand/60",
  rose: "bg-pastel-rose/40",
};

export function MetricCard({
  label, value, prev, current, unit, digits = 2, series, tone = "sand", explainer, size = "md",
}: MetricCardProps) {
  const change = prev !== undefined && current !== undefined ? pctChange(current, prev) : undefined;
  const up = (change ?? 0) >= 0;

  return (
    <div className="group relative rounded-3xl bg-card soft-shadow p-5 sm:p-6 transition hover:soft-shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className={cn("h-8 w-8 rounded-2xl", toneBg[tone])} />
          <div className="text-[13px] font-medium text-muted-foreground">{label}</div>
        </div>
        {explainer && (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button aria-label="Explicație" className="text-muted-foreground/60 hover:text-foreground transition">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[260px] text-[12px] leading-relaxed">
                {explainer}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <div className={cn(
            "font-semibold tracking-tight tabular-nums",
            size === "lg" ? "text-4xl" : size === "sm" ? "text-2xl" : "text-3xl",
          )}>
            {typeof value === "number" ? fmtNum(value, digits) : value}
            {unit && <span className="ml-1 text-base font-medium text-muted-foreground">{unit}</span>}
          </div>
          {change !== undefined && (
            <div className={cn(
              "mt-1 inline-flex items-center gap-1 text-[12.5px] font-medium rounded-full px-2 py-0.5",
              up ? "bg-up/40 text-up-foreground" : "bg-down/40 text-down-foreground",
            )}>
              {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {fmtPct(change)}
            </div>
          )}
        </div>
        {series && series.length > 1 && (
          <div className="w-28 sm:w-32 h-[50px] opacity-95">
            <Sparkline data={series} positive={up} />
          </div>
        )}
      </div>
    </div>
  );
}
