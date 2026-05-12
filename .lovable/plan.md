# Plan de implementare

Voi executa în ordinea cerută (G), confirmând după fiecare etapă majoră.

## Etapa 1 — Iconițe Dobânzi & Macro
- `src/routes/dobanzi.tsx`: import lucide (`Landmark, Percent, LineChart, Receipt, Flame, Activity, Users, Wallet, Info`) și pasare `icon={...}` la fiecare `MetricCard`. Caseta "Ce înseamnă pentru tine?" capătă `Info` în header.
- `src/routes/macro.tsx`: actualizez array-ul `macroCards` cu câmp `icon` (`BarChart3, TrendingUp, Receipt, TrendingDown, ArrowLeftRight, Coins`) și cardurile de combustibili (`Fuel, Fuel, Droplet`). `MetricCard` deja suportă prop `icon` + cerc pastel — nu schimb stilul.

## Etapa 2 — Server function `getBnrToday` (există deja) + bandă LIVE pe Acasă
- Sub butoanele hero din `src/routes/index.tsx` adaug o bandă orizontală cu valori live (`EUR · USD · BET · ROBOR 3M · Inflație`) trase din hooks reale (BET/ROBOR/Inflație rămân demo cu badge până la etapele 4–5; voi marca explicit ce e demo, nu valori inventate fără semnalare).
- Confirm că `useBnrToday` e deja cablat la EUR/USD/GBP/CHF.

## Etapa 3 — `getBnrHistory` (există) + sparklines reale + grafic perioade
- Verific că pagina Curs valutar folosește deja `useBnrHistory(5)` cu butoane 1L/6L/1A/5A. Adaug sparklines reale pe cardurile EUR/USD/GBP/CHF de pe Acasă (din history 30 zile).

## Etapa 4 — `bnr-indicators` (ROBOR/IRCC/dobânda BNR)
- `src/lib/bnr-indicators.functions.ts`: `createServerFn` GET, fetch `https://www.bnr.ro/Indicatori-de-dobanda-1740.aspx`, parse cu `cheerio` (bun add cheerio), extrage ROBOR 3M/6M/12M, IRCC, rata politică monetară. Returnează `{values, asOf}`. Cache 12h via React Query `staleTime`. Dacă pică, returnează `{error, lastKnown:null}` → UI afișează AlertCircle + "Sursă indisponibilă".
- `src/lib/use-bnr-indicators.ts` cu hook `useBnrIndicators()`.
- Integrez în `dobanzi.tsx` la cardurile BNR/ROBOR/IRCC, cu sursă "BNR · Actualizat [data]".

## Etapa 5 — `ins-inflation`
- `src/lib/ins.functions.ts`: server fn care încearcă endpoint INS public (Tempo Online JSON dacă disponibil; fallback HTML scrape pe `insse.ro`). Returnează `{inflationYoY, inflationMoM, unemployment, avgNetSalary, asOf}` sau `{error}`. NU inventează valori — la eroare, UI arată "Date indisponibile · ultima încercare [oră]".
- Hook `useInsIndicators()` în `src/lib/use-ins.ts`.
- Integrez în `dobanzi.tsx` (Inflație, șomaj, salariu).

## Etapa 6 — TradingView pe Bursă
- Componente noi:
  - `src/components/TradingViewAdvancedChart.tsx` (BVB:BET, configurabil perioadă via `interval`/`range`).
  - `src/components/TradingViewMarketOverview.tsx` (lista companiilor BVB).
  - `src/components/TradingViewScreener.tsx` (filtru BVB, sortat după variație).
- Toate folosesc embed scripts oficiale (`s3.tradingview.com/external-embedding/embed-widget-*.js`), tema sincronizată cu `<html class="dark">` via `MutationObserver`. Înlocuiesc secțiunile mock din `bursa.tsx`. Notă: funcționează strict client-side (`useEffect` + `<ClientOnly>`).

## Etapa 7 — Admin macro
- Tabel `macro_values` în Lovable Cloud (key, value, unit, updated_at, updated_by). RLS: read public, write doar admin.
- **Auth**: necesită Lovable Cloud + un cont admin. Pentru simplitate, încep cu varianta cerută explicit: parolă hardcoded în env (`ADMIN_PASSWORD`) verificată într-un server fn `adminLogin` care setează un cookie de sesiune semnat. Pagina `/admin` cu formular login + tabel editabil. Toate write-urile trec prin server fn ce verifică cookie-ul.
- Pagina `macro.tsx` citește valorile din DB (cu fallback la valorile curente din `mock-data.ts`).

## Etapa 8 — Timestamp + badge "Date demo"
- `MetricCard` are deja `source` + `demo`. Trec prin toate cardurile și completez consecvent: live → `source="BNR · Actualizat 12 mai 2026, 13:00"` cu CheckCircle2 verde; demo → `demo` + tooltip "Date actualizate manual trimestrial. Sursă: INS, MFP, Eurostat."

## Detalii tehnice
- **Worker compat**: `cheerio` rulează în Workers cu nodejs_compat (folosește doar parserul, nu jsdom). Verific la runtime; dacă pică, comut pe `htmlparser2` direct (deja dependență a cheerio) sau parser regex.
- **CORS**: server functions sunt same-origin, nu necesită CORS headers.
- **Erori reale, nu mock**: la fiecare server fn, dacă fetch eșuează → returnez `{error, asOf:null}`; UI afișează `stale=true` + AlertCircle, fără valori inventate.
- **Cache**: prin React Query `staleTime` (6h/12h/24h) — nu cache server-side persistent (Worker nu are KV configurat).

## Întrebări înainte de start
1. **Admin auth**: confirmi parolă hardcoded în secret env (`ADMIN_PASSWORD`) cu cookie de sesiune? Sau preferi auth Lovable Cloud full (email+parolă, rol admin în `user_roles`)? A doua e mai sigură dar adaugă ~30 min.
2. **INS scraping**: insse.ro nu are API JSON public stabil. Dacă scraping eșuează, accepți ca inflație/șomaj/salariu să apară ca "Date indisponibile" până configurăm o sursă alternativă (ex. Eurostat API)?
3. **TradingView**: simbolurile BVB pot să nu fie toate disponibile pe TradingView (ex. H2O Hidroelectrica e listată recent). OK să afișez "simbol indisponibil" pe cele care lipsesc, în loc să le ascund?
