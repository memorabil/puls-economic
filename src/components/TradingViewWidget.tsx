import { useEffect, useRef, useState } from "react";

type WidgetType = "advanced-chart" | "market-overview" | "screener";

interface Props {
  type: WidgetType;
  config: Record<string, unknown>;
  height?: number;
  className?: string;
}

const SCRIPT_URLS: Record<WidgetType, string> = {
  "advanced-chart": "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
  "market-overview": "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js",
  screener: "https://s3.tradingview.com/external-embedding/embed-widget-screener.js",
};

function isDark(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

export function TradingViewWidget({ type, config, height = 480, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">(isDark() ? "dark" : "light");

  // Watch theme changes
  useEffect(() => {
    if (typeof MutationObserver === "undefined") return;
    const obs = new MutationObserver(() => setTheme(isDark() ? "dark" : "light"));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.innerHTML = "";
    const inner = document.createElement("div");
    inner.className = "tradingview-widget-container__widget";
    inner.style.height = `${height}px`;
    inner.style.width = "100%";
    el.appendChild(inner);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = SCRIPT_URLS[type];
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: theme,
      isTransparent: true,
      width: "100%",
      height,
      locale: "ro",
      ...config,
    });
    el.appendChild(script);

    return () => {
      el.innerHTML = "";
    };
  }, [type, height, theme, JSON.stringify(config)]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ minHeight: height }}
    />
  );
}
