import { createServerFn } from "@tanstack/react-start";
import { XMLParser } from "fast-xml-parser";

export type BnrToday = {
  date: string;
  rates: Record<string, number>;
};

export type BnrHistory = {
  // ISO date -> rates map
  series: Record<string, Record<string, number>>;
};

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

function parseCube(cubeNode: any): { date: string; rates: Record<string, number> } {
  const date: string = cubeNode["@_date"];
  const rateArr = Array.isArray(cubeNode.Rate) ? cubeNode.Rate : [cubeNode.Rate];
  const rates: Record<string, number> = {};
  for (const r of rateArr) {
    if (!r) continue;
    const code = r["@_currency"];
    const mult = r["@_multiplier"] ? Number(r["@_multiplier"]) : 1;
    const val = Number(r["#text"] ?? r);
    if (code && Number.isFinite(val)) rates[code] = +(val / mult).toFixed(6);
  }
  return { date, rates };
}

export const getBnrToday = createServerFn({ method: "GET" }).handler(async (): Promise<BnrToday> => {
  try {
    const res = await fetch("https://www.bnr.ro/nbrfxrates.xml", {
      headers: { Accept: "application/xml" },
    });
    if (!res.ok) throw new Error(`BNR ${res.status}`);
    const xml = await res.text();
    const j = parser.parse(xml);
    const cube = j?.DataSet?.Body?.Cube;
    if (!cube) throw new Error("Cube missing");
    return parseCube(cube);
  } catch (e) {
    console.error("getBnrToday error", e);
    return { date: "", rates: {} };
  }
});

async function fetchYear(year: number): Promise<Record<string, Record<string, number>>> {
  const url = `https://www.bnr.ro/files/xml/years/nbrfxrates${year}.xml`;
  const res = await fetch(url, { headers: { Accept: "application/xml" } });
  if (!res.ok) throw new Error(`BNR ${year} ${res.status}`);
  const xml = await res.text();
  const j = parser.parse(xml);
  const cubes = j?.DataSet?.Body?.Cube;
  if (!cubes) return {};
  const arr = Array.isArray(cubes) ? cubes : [cubes];
  const out: Record<string, Record<string, number>> = {};
  for (const c of arr) {
    const { date, rates } = parseCube(c);
    if (date) out[date] = rates;
  }
  return out;
}

export const getBnrHistory = createServerFn({ method: "GET" })
  .inputValidator((data: { years?: number } | undefined) => data ?? { years: 1 })
  .handler(async ({ data }): Promise<BnrHistory> => {
    const yrs = Math.max(1, Math.min(6, data.years ?? 1));
    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const years: number[] = [];
    for (let i = 0; i < yrs; i++) years.push(currentYear - i);
    try {
      const merged: Record<string, Record<string, number>> = {};
      const results = await Promise.all(years.map((y) => fetchYear(y).catch(() => ({}))));
      for (const r of results) Object.assign(merged, r);
      return { series: merged };
    } catch (e) {
      console.error("getBnrHistory error", e);
      return { series: {} };
    }
  });
