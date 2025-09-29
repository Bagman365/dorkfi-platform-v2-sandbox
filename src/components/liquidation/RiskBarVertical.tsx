import React from "react";

export default function RiskBarVertical({
  hf,
  className = "",
}: { hf: number; className?: string }) {
  const clamped = Math.max(0.8, Math.min(3.0, hf));
  const bottomPct = ((3.0 - clamped) / (3.0 - 0.8)) * 100;

  return (
    <div className={`relative w-3 rounded-full bg-white/10 ${className}`} aria-label={`Risk scale, marker at ${Math.round(bottomPct)}%`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-rose-500 via-yellow-300 to-teal-400 opacity-80" />
      <div
        className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full ring-2 ring-white/60 bg-white shadow transition-all duration-500"
        style={{ bottom: `${bottomPct}%` }}
      />
      {/* Tick labels (hide on xs) */}
      <div className="absolute -right-10 inset-y-0 hidden sm:block text-xs leading-none text-white/70 font-medium">
        <span className="absolute top-0">High</span>
        <span className="absolute top-1/2 -translate-y-1/2">Mid</span>
        <span className="absolute bottom-0">Low</span>
      </div>
    </div>
  );
}
