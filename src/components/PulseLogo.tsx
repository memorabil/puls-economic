export function PulseLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-full ${className}`} style={{ background: "color-mix(in oklab, var(--pastel-blue) 50%, transparent)" }}>
      <svg viewBox="0 0 32 32" className="h-1/2 w-1/2" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path
          d="M2 17 H9 L11.5 11 L14.5 22 L17.5 8 L20.5 23 L23 17 H30"
          stroke="oklch(0.32 0.02 260)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
