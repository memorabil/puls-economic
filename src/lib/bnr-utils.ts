import type { BnrHistory } from "./bnr.functions";

export const CURRENCY_META: Record<string, { name: string; region: string; iso2: string }> = {
  EUR: { name: "Euro", region: "Zona Euro", iso2: "eu" },
  USD: { name: "Dolar american", region: "SUA", iso2: "us" },
  GBP: { name: "Liră sterlină", region: "Marea Britanie", iso2: "gb" },
  CHF: { name: "Franc elvețian", region: "Elveția", iso2: "ch" },
  JPY: { name: "Yen japonez", region: "Japonia", iso2: "jp" },
  AUD: { name: "Dolar australian", region: "Australia", iso2: "au" },
  CAD: { name: "Dolar canadian", region: "Canada", iso2: "ca" },
  HUF: { name: "Forint maghiar", region: "Ungaria", iso2: "hu" },
  PLN: { name: "Zlot polonez", region: "Polonia", iso2: "pl" },
  CZK: { name: "Coroană cehă", region: "Cehia", iso2: "cz" },
  BGN: { name: "Lev bulgăresc", region: "Bulgaria", iso2: "bg" },
  SEK: { name: "Coroană suedeză", region: "Suedia", iso2: "se" },
  NOK: { name: "Coroană norvegiană", region: "Norvegia", iso2: "no" },
  DKK: { name: "Coroană daneză", region: "Danemarca", iso2: "dk" },
  TRY: { name: "Liră turcească", region: "Turcia", iso2: "tr" },
  CNY: { name: "Yuan chinezesc", region: "China", iso2: "cn" },
};

export const PRIMARY_CODES = ["EUR", "USD", "GBP", "CHF", "JPY", "AUD", "CAD", "HUF", "PLN", "CZK", "BGN"] as const;

export function seriesForCode(history: BnrHistory | undefined, code: string, days: number): number[] {
  if (!history?.series) return [];
  const dates = Object.keys(history.series).sort();
  const last = dates.slice(-days);
  const out: number[] = [];
  for (const d of last) {
    const v = history.series[d]?.[code];
    if (Number.isFinite(v)) out.push(v as number);
  }
  return out;
}

export function formatRoDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00Z");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });
}
