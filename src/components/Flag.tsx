import "flag-icons/css/flag-icons.min.css";

export function Flag({ iso2, className = "" }: { iso2: string; className?: string }) {
  return (
    <span
      className={`fi fi-${iso2.toLowerCase()} inline-block rounded-[3px] shadow-sm ${className}`}
      style={{ width: "1em", height: "0.75em", lineHeight: 0 }}
      aria-hidden
    />
  );
}
