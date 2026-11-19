export function Logo({ claro = false, compacto = false }: { claro?: boolean; compacto?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <rect width="34" height="34" rx="10" fill={claro ? "#ffffff" : "#0E3B43"} />
        <path
          d="M7 25 C12 25, 13 17, 17 17 S 22 10, 27 9"
          stroke="#D9A21B"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="7" cy="25" r="2.6" fill={claro ? "#0E3B43" : "#ffffff"} />
        <circle cx="27" cy="9" r="2.6" fill="#D9A21B" />
      </svg>
      {!compacto && (
        <span className={`font-display text-[1.15rem] font-bold leading-none ${claro ? "text-white" : "text-ink"}`}>
          Rota do Investidor
        </span>
      )}
    </span>
  );
}
