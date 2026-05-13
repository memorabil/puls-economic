import { createServerFn } from "@tanstack/react-start";

export type BnrIndicators = {
  asOf: string | null;
  values: {
    bnrPolicy?: number;
    robor3M?: number;
    robor6M?: number;
    robor12M?: number;
    ircc?: number;
  };
  error?: string;
};

// Strip HTML tags and normalize whitespace
function stripHtml(s: string): string {
  return s
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");
}

function findNear(text: string, label: RegExp): number | undefined {
  const m = text.match(label);
  if (!m) return undefined;
  // Look for first number after the label within ~120 chars
  const after = text.slice(m.index! + m[0].length, m.index! + m[0].length + 200);
  const n = after.match(/(\d{1,2}[.,]\d{1,4})\s*%?/);
  if (!n) return undefined;
  const v = parseFloat(n[1].replace(",", "."));
  return Number.isFinite(v) ? v : undefined;
}

export const getBnrIndicators = createServerFn({ method: "GET" }).handler(
  async (): Promise<BnrIndicators> => {
    try {
      const res = await fetch("https://www.bnr.ro/Indicatori-de-dobanda-1740.aspx", {
        headers: { Accept: "text/html", "User-Agent": "Mozilla/5.0 (PulsEconomic)" },
      });
      if (!res.ok) throw new Error(`BNR ${res.status}`);
      const html = await res.text();
      const text = stripHtml(html);

      const values = {
        bnrPolicy: findNear(text, /rata\s+dob[aâ]nzii\s+de\s+politic[aă]\s+monetar[aă]/i),
        robor3M: findNear(text, /ROBOR\s*(la\s*)?3\s*luni/i),
        robor6M: findNear(text, /ROBOR\s*(la\s*)?6\s*luni/i),
        robor12M: findNear(text, /ROBOR\s*(la\s*)?12\s*luni/i),
        ircc: findNear(text, /\bIRCC\b/i),
      };

      // Try to extract a date (dd.mm.yyyy)
      const dateMatch = text.match(/(\d{1,2}\.\d{1,2}\.\d{4})/);
      const asOf = dateMatch ? dateMatch[1] : null;

      const hasAny = Object.values(values).some((v) => v !== undefined);
      if (!hasAny) throw new Error("Nu am putut extrage indicatorii");

      return { asOf, values };
    } catch (e: any) {
      console.error("getBnrIndicators error", e);
      return { asOf: null, values: {}, error: e?.message ?? "Eroare necunoscută" };
    }
  }
);
