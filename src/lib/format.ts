export const fmtNum = (n: number, digits = 2) =>
  new Intl.NumberFormat("ro-RO", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);

export const fmtPct = (n: number, digits = 2) => `${n > 0 ? "+" : ""}${fmtNum(n, digits)}%`;

export const fmtRON = (n: number, digits = 2) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);

export const pctChange = (curr: number, prev: number) => ((curr - prev) / prev) * 100;
