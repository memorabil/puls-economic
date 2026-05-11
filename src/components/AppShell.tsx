import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Coins, LineChart, Percent, Globe2, Moon, Sun, Mail, Database, Check, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { lastUpdated } from "@/lib/mock-data";
import { PulseLogo } from "./PulseLogo";

const navItems = [
  { to: "/", label: "Acasă", icon: Home },
  { to: "/curs-valutar", label: "Curs valutar", icon: Coins },
  { to: "/bursa", label: "Bursă", icon: LineChart },
  { to: "/dobanzi", label: "Dobânzi & Inflație", icon: Percent },
  { to: "/macro", label: "Macro & Context", icon: Globe2 },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [dark, setDark] = useState(false);
  // Avoid SSR/CSR hydration mismatch — set time only after mount.
  const [time, setTime] = useState<string>("--:--");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    setTime(lastUpdated());
    const t = setInterval(() => setTime(lastUpdated()), 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 glass border-b border-border/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <PulseLogo className="h-9 w-9" />
            <div className="leading-tight">
              <div className="text-[15px] font-semibold tracking-tight">PulsEconomic</div>
              <div className="text-[10.5px] text-muted-foreground/70">Tablou de bord</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 rounded-full bg-muted/70 p-1">
            {navItems.map((item) => {
              const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-all ${
                    active ? "bg-card text-foreground soft-shadow" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => setDark((d) => !d)}
            aria-label="Comută tema"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/70 hover:bg-muted transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden flex gap-1 overflow-x-auto px-3 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-full whitespace-nowrap transition-all ${
                  active ? "bg-card text-foreground soft-shadow" : "bg-muted/60 text-muted-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">{children}</main>

      <footer className="border-t border-border/50 mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-[13px]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <PulseLogo className="h-7 w-7" />
              <div className="font-semibold">PulsEconomic</div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Pulsul economiei României, explicat simplu pentru oricine vrea să înțeleagă ce se întâmplă cu banii săi.
            </p>
          </div>
          <div>
            <div className="font-semibold mb-3 inline-flex items-center gap-1.5"><Database strokeWidth={1.5} className="h-3.5 w-3.5" /> Surse de date</div>
            <ul className="space-y-1.5 text-muted-foreground">
              <li><a href="https://www.bnr.ro" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Banca Națională a României</a></li>
              <li><a href="https://www.bvb.ro" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Bursa de Valori București</a></li>
              <li><a href="https://insse.ro" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Institutul Național de Statistică</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3 inline-flex items-center gap-1.5"><Mail strokeWidth={1.5} className="h-3.5 w-3.5" /> Contact &amp; Feedback</div>
            <a href="mailto:salut@pulseconomic.ro" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <Mail className="h-3.5 w-3.5" /> salut@pulseconomic.ro
            </a>
            <p className="mt-3 text-muted-foreground">Ai o sugestie? Scrie-ne.</p>
          </div>
        </div>
        <div className="border-t border-border/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-col gap-2 text-[11.5px] text-muted-foreground">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="inline-flex items-center gap-1.5"><Check strokeWidth={1.5} className="h-3 w-3 text-up-foreground" /> Curs valutar: date oficiale BNR</span>
              <span className="inline-flex items-center gap-1.5"><AlertTriangle strokeWidth={1.5} className="h-3 w-3 text-[oklch(0.7_0.12_70)]" /> Restul indicatorilor: date demo în această versiune</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>© 2026 PulsEconomic.ro · Nu constituie sfat financiar.</div>
              <div>Ultima actualizare: <span className="text-foreground/80 font-medium" suppressHydrationWarning>{time}</span></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
