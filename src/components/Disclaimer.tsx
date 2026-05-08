import { Info } from "lucide-react";

export function Disclaimer() {
  return (
    <div className="flex items-start gap-2 rounded-2xl bg-muted/50 px-4 py-2.5 text-[12px] text-muted-foreground">
      <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
      <span>Informațiile sunt orientative și nu constituie recomandare de investiție.</span>
    </div>
  );
}
