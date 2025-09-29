import React from "react";

export default function RiskBarVertical({ hf }: { hf: number }) {
  // Clamp HF to sane bounds
  const clamped = Math.max(0.8, Math.min(3.0, hf));

  // Marker position (bottom%) — low HF = higher on the bar (riskier)
  const bottomPct = ((3.0 - clamped) / (3.0 - 0.8)) * 100;

  return (
    <div className="flex items-center gap-3">
      {/* Track */}
      <div className="relative h-40 w-3 rounded-full overflow-hidden bg-white/10">
        {/* Gradient from High (top/red) → Low (bottom/teal) */}
        <div className="absolute inset-0 bg-gradient-to-b from-rose-500 via-yellow-300 to-teal-400 opacity-80" />

        {/* Marker (use 🐙 or swap for an octopus image) */}
        <span
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl drop-shadow transition-all duration-500"
          style={{ bottom: `${bottomPct}%` }}
          role="img"
          aria-label="risk level"
        >
          🐙
        </span>
      </div>

      {/* Labels */}
      <div className="flex flex-col text-sm leading-5">
        <span className="text-rose-400 font-medium">High-Risk!</span>
        <span className="text-yellow-300 my-2">Mid-Risk</span>
        <span className="text-teal-300">Low Risk</span>
      </div>
    </div>
  );
}
