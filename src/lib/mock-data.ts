// Realistic mock data for the Romanian economy dashboard.
// All values are illustrative and updated to feel current (May 2026).

export type Spark = number[];

const rand = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

export function makeSeries(start: number, len: number, vol = 0.01, seed = 42): Spark {
  const r = rand(seed);
  const out: number[] = [start];
  for (let i = 1; i < len; i++) {
    const change = (r() - 0.5) * 2 * vol * start;
    out.push(+(out[i - 1] + change).toFixed(4));
  }
  return out;
}

// FX (RON per 1 unit foreign currency) — BNR style
export const currencies = [
  { code: "EUR", name: "Euro", flag: "🇪🇺", rate: 4.9785, prev: 4.9712, region: "Zona Euro" },
  { code: "USD", name: "Dolar american", flag: "🇺🇸", rate: 4.5621, prev: 4.5890, region: "SUA" },
  { code: "GBP", name: "Liră sterlină", flag: "🇬🇧", rate: 5.8104, prev: 5.7998, region: "Marea Britanie" },
  { code: "CHF", name: "Franc elvețian", flag: "🇨🇭", rate: 5.0432, prev: 5.0380, region: "Elveția" },
  { code: "JPY", name: "Yen japonez (100)", flag: "🇯🇵", rate: 2.9745, prev: 2.9810, region: "Japonia" },
  { code: "AUD", name: "Dolar australian", flag: "🇦🇺", rate: 3.0125, prev: 3.0050, region: "Australia" },
  { code: "CAD", name: "Dolar canadian", flag: "🇨🇦", rate: 3.3210, prev: 3.3145, region: "Canada" },
  { code: "HUF", name: "Forint maghiar (100)", flag: "🇭🇺", rate: 1.2487, prev: 1.2510, region: "Ungaria" },
  { code: "PLN", name: "Zlot polonez", flag: "🇵🇱", rate: 1.1632, prev: 1.1605, region: "Polonia" },
  { code: "CZK", name: "Coroană cehă", flag: "🇨🇿", rate: 0.2018, prev: 0.2014, region: "Cehia" },
  { code: "BGN", name: "Lev bulgăresc", flag: "🇧🇬", rate: 2.5454, prev: 2.5419, region: "Bulgaria" },
];

export const fxSeries = (code: string, days: number) => {
  const c = currencies.find((x) => x.code === code) ?? currencies[0];
  const seed = code.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  const raw = makeSeries(c.rate * 0.97, days, 0.004, seed);
  // Smoothly blend the series so that the last point lands on the current rate
  // without an artificial spike.
  const last = raw[raw.length - 1];
  const drift = c.rate - last;
  return raw.map((v, i) => +(v + (drift * i) / (raw.length - 1)).toFixed(4));
};

// BET index & companies
export const betIndex = {
  value: 18642.51,
  prev: 18510.32,
  series: makeSeries(17800, 30, 0.008, 7),
};

export const companies = [
  { ticker: "H2O", name: "Hidroelectrica", price: 132.4, prev: 130.1, mcap: 59.5, sector: "Energie" },
  { ticker: "SNG", name: "Romgaz", price: 58.20, prev: 58.95, mcap: 22.4, sector: "Energie" },
  { ticker: "SNP", name: "OMV Petrom", price: 0.852, prev: 0.844, mcap: 51.8, sector: "Energie" },
  { ticker: "TLV", name: "Banca Transilvania", price: 32.18, prev: 31.85, mcap: 25.6, sector: "Bănci" },
  { ticker: "BRD", name: "BRD - Groupe SG", price: 21.40, prev: 21.55, mcap: 14.9, sector: "Bănci" },
  { ticker: "FP", name: "Fondul Proprietatea", price: 0.612, prev: 0.608, mcap: 5.4, sector: "Investiții" },
  { ticker: "SNN", name: "Nuclearelectrica", price: 64.50, prev: 65.10, mcap: 19.4, sector: "Energie" },
  { ticker: "DIGI", name: "Digi Communications", price: 78.20, prev: 76.40, mcap: 7.8, sector: "Telecom" },
  { ticker: "TRP", name: "TeraPlast", price: 0.428, prev: 0.422, mcap: 0.81, sector: "Materiale" },
  { ticker: "EL", name: "Electrica", price: 12.85, prev: 12.92, mcap: 4.4, sector: "Utilități" },
  { ticker: "TGN", name: "Transgaz", price: 28.10, prev: 27.95, mcap: 3.3, sector: "Utilități" },
  { ticker: "M", name: "Medlife", price: 4.12, prev: 4.05, mcap: 0.88, sector: "Sănătate" },
];

export const companySeries = (ticker: string) => {
  const c = companies.find((x) => x.ticker === ticker) ?? companies[0];
  const seed = ticker.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  const arr = makeSeries(c.price * 0.92, 30, 0.018, seed);
  arr[arr.length - 1] = c.price;
  return arr;
};

// Rates & inflation
export const rates = {
  bnrPolicy: 6.5,
  robor3M: 5.78,
  robor6M: 5.92,
  robor12M: 6.05,
  ircc: 5.66,
  bond10y: 6.85,
  bond5y: 6.42,
};

export const inflation = {
  monthly: 0.4,
  yearly: 4.2,
  series: [6.6, 6.1, 5.8, 5.5, 5.2, 4.9, 4.7, 4.5, 4.4, 4.3, 4.2, 4.2],
  labels: ["Iun", "Iul", "Aug", "Sep", "Oct", "Noi", "Dec", "Ian", "Feb", "Mar", "Apr", "Mai"],
};

export const labor = {
  unemployment: 5.4,
  avgNetSalary: 5128, // RON
  avgGrossSalary: 8245,
};

// Macro
export const macro = {
  gdp: 332.5, // billion EUR
  gdpGrowth: 2.1,
  publicDebt: 51.8, // % GDP
  budgetDeficit: -6.2, // % GDP
  tradeBalance: -28.4, // billion EUR
  fuel95: 7.42, // RON / l
  fuelDiesel: 7.68,
  gold: 432.5, // RON / g
  brent: 78.4, // USD / barrel
};

export const neighbors = [
  { country: "România", flag: "🇷🇴", inflation: 4.2, gdpGrowth: 2.1, unemployment: 5.4, debt: 51.8 },
  { country: "Bulgaria", flag: "🇧🇬", inflation: 2.8, gdpGrowth: 2.6, unemployment: 4.3, debt: 23.1 },
  { country: "Ungaria", flag: "🇭🇺", inflation: 4.0, gdpGrowth: 2.2, unemployment: 4.5, debt: 73.5 },
  { country: "Polonia", flag: "🇵🇱", inflation: 3.5, gdpGrowth: 3.1, unemployment: 2.9, debt: 49.6 },
];

export const lastUpdated = () =>
  new Date().toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });

// 5-year mini series for macro cards (60 monthly points)
export const macroSeries = (key: string, end: number, vol = 0.04) => {
  const seed = key.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  const raw = makeSeries(end * 0.85, 60, vol, seed);
  const last = raw[raw.length - 1];
  const drift = end - last;
  return raw.map((v, i) => +(v + (drift * i) / (raw.length - 1)).toFixed(2));
};

// Sparkline series for a generic indicator (30 days)
export const indicatorSeries = (key: string, end: number, vol = 0.02) => {
  const seed = key.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  const raw = makeSeries(end * 0.97, 30, vol, seed);
  const last = raw[raw.length - 1];
  const drift = end - last;
  return raw.map((v, i) => +(v + (drift * i) / (raw.length - 1)).toFixed(3));
};

// Trading volumes (top by daily volume)
export const volumes = [
  { ticker: "TLV", volume: 32.4 },
  { ticker: "SNP", volume: 28.7 },
  { ticker: "H2O", volume: 24.1 },
  { ticker: "FP", volume: 18.6 },
  { ticker: "BRD", volume: 12.3 },
];

// Bank deposit rates (mock, % p.a.)
export const deposits = [
  { term: "6 luni", ron: 5.4, eur: 1.8 },
  { term: "12 luni", ron: 5.8, eur: 2.1 },
  { term: "24 luni", ron: 5.5, eur: 2.4 },
];

// Three weekly highlights
export const weeklyHighlights = [
  { title: "Inflația", value: "4,2%", note: "În scădere a 11-a lună la rând — apropriere lentă de ținta BNR." },
  { title: "Cursul EUR", value: "4,9785", note: "Leul rămâne stabil în jurul pragului de 5 lei pentru un euro." },
  { title: "Indicele BET", value: "18.642", note: "Bursa locală încheie săptămâna în creștere, susținută de energetice." },
];
