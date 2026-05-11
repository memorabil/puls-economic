import { HelpCircle, ArrowUpRight, ArrowDownRight, Check, AlertCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sparkline } from "./Sparkline";
import { DemoBadge } from "./DemoBadge";
import { fmtNum, fmtPct, pctChange } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

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
  icon?: LucideIcon;
  leading?: ReactNode;
  demo?: boolean;
  source?: string;
  loading?: boolean;
  stale?: boolean;
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
const toneText: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  blue: "text-[oklch(0.45_0.08_240)]",
  mint: "text-[oklch(0.45_0.08_160)]",
  peach: "text-[oklch(0.5_0.1_30)]",
  lavender: "text-[oklch(0.45_0.08_290)]",
  butter: "text-[oklch(0.5_0.09_85)]",
  sand: "text-[oklch(0.45_0.04_60)]",
  rose: "text-[oklch(0.5_0.09_10)]",
};

export function MetricCard({
  label, value, prev, current, unit, digits = 2, series, tone = "sand", explainer, size = "md",
  icon: Icon, leading, demo, source, loading, stale,
}: MetricCardProps) {
  const change = prev !== undefined && current !== undefined ? pctChange(current, prev) : undefined;
  const up = (change ?? 0) >= 0;

  return (
    <div className="group relative rounded-3xl bg-card soft-shadow p-5 sm:p-6 transition hover:soft-shadow-lg">
      {demo && (
        <div className="absolute right-3 top-3">
          <DemoBadge />
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {leading ? (
            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", toneBg[tone])}>
              {leading}
            </div>
          ) : Icon ? (
            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", toneBg[tone])}>
              <Icon strokeWidth={1.5} className={cn("h-5 w-5", toneText[tone])} />
            </div>
          ) : (
            <div className={cn("h-8 w-8 rounded-full", toneBg[tone])} />
          )}
          <div className="text-[13px] font-medium text-muted-foreground truncate">{label}</div>
        </div>
        {explainer && !demo && (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button aria-label="Explicație" className="text-muted-foreground/60 hover:text-foreground transition">
                  <HelpCircle strokeWidth={1.5} className="h-4 w-4" />
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
          {loading ? (
            <div className="h-9 w-24 rounded-md bg-muted/70 animate-pulse" />
          ) : (
            <div className={cn(
              "font-semibold tracking-tight tabular-nums",
              size === "lg" ? "text-4xl" : size === "sm" ? "text-2xl" : "text-3xl",
            )}>
              {typeof value === "number" ? fmtNum(value, digits) : value}
              {unit && <span className="ml-1 text-base font-medium text-muted-foreground">{unit}</span>}
            </div>
          )}
          {change !== undefined && !loading && (
            <div className={cn(
              "mt-1 inline-flex items-center gap-1 text-[12.5px] font-medium rounded-full px-2 py-0.5",
              up ? "bg-up/40 text-up-foreground" : "bg-down/40 text-down-foreground",
            )}>
              {up ? <ArrowUpRight strokeWidth={1.5} className="h-3.5 w-3.5" /> : <ArrowDownRight strokeWidth={1.5} className="h-3.5 w-3.5" />}
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

      {source && (
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          {stale ? (
            <AlertCircle strokeWidth={1.5} className="h-3 w-3 text-[oklch(0.7_0.12_70)]" />
          ) : (
            <Check strokeWidth={1.5} className="h-3 w-3 text-up-foreground" />
          )}
          <span>{source}</span>
        </div>
      )}
    </div>
  );
}
