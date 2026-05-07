import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Coins, LineChart, Percent, Globe2, Moon, Sun, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { lastUpdated } from "@/lib/mock-data";

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
  const [time, setTime] = useState(lastUpdated());

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const t = setInterval(() => setTime(lastUpdated()), 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 glass border-b border-border/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-pastel-blue/60">
              <Activity className="h-4 w-4 text-foreground/80" strokeWidth={2.2} />
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-semibold tracking-tight">Economia României</div>
              <div className="text-[11px] text-muted-foreground">Tablou de bord</div>
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
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/70 hover:bg-muted transition"
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

      <footer className="mx-auto max-w-7xl px-4 sm:px-6 py-8 text-center text-[12px] text-muted-foreground">
        <div>Ultima actualizare: <span className="text-foreground/80 font-medium">{time}</span></div>
        <div className="mt-1">Date orientative · Surse: BNR, BVB, INS · Construit pentru claritate</div>
      </footer>
    </div>
  );
}
