import { FlaskConical } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`inline-flex items-center gap-1 rounded-lg border px-1.5 py-0.5 text-[11px] font-medium ${className}`}
            style={{
              color: "color-mix(in oklab, #c9622a 80%, transparent)",
              borderColor: "color-mix(in oklab, #F5C9B8 80%, transparent)",
              background: "color-mix(in oklab, #F5C9B8 25%, transparent)",
            }}
          >
            <FlaskConical strokeWidth={1.5} className="h-3 w-3" />
            Date demo
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[240px] text-[12px] leading-relaxed">
          Date orientative — vor fi conectate la surse oficiale în versiunea finală.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
