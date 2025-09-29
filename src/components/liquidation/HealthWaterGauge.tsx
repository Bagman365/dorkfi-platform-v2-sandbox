import React, { useMemo } from "react";
import RiskBarVertical from "./RiskBarVertical";

type Props = {
  healthFactor: number;
  avatarSrc?: string;
};

export default function HealthWaterGauge({ healthFactor, avatarSrc }: Props) {
  const hf = Math.max(0.8, Math.min(3.0, healthFactor));

  // Map HF -> water height (lower HF = more water)
  // 3.0 -> 10%, 1.2 -> 75%, 0.8 -> 92%
  const waterPct = useMemo(() => {
    const t = (3.0 - hf) / (3.0 - 0.8);
    return Math.round(10 + t * 82);
  }, [hf]);

  const risk = hf >= 2.0 ? "Low Risk" : hf >= 1.2 ? "Mid Risk" : "High Risk";
  const riskColor = hf >= 2 ? "text-teal-300" : hf >= 1.2 ? "text-yellow-300" : "text-rose-400";

  return (
    <div className="rounded-2xl border border-white/10 p-6 bg-[#0d1f2a]">
      <div className="mb-3 text-white/90 font-semibold">Health Factor</div>

      {/* 2-col: avatar + gauge/metrics (lg), stacked (sm) */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
        {/* Avatar with water overlay */}
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#162734]">
          {/* Optional avatar below the mask */}
          {avatarSrc && (
            <img
              src={avatarSrc}
              alt="avatar"
              className="absolute inset-0 w-full h-full object-cover opacity-95"
            />
          )}

          {/* Base placeholder image */}
          <img
            src="/lovable-uploads/dork_health_placeholder_v2.png"
            alt="Health placeholder"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* WATER OVERLAY — masked to the placeholder silhouette */}
          <div
            className="absolute inset-x-0 bottom-0 transition-all duration-500 ease-out"
            style={{ height: `${waterPct}%` }}
          >
            <div
              className="relative w-full h-full opacity-95"
              style={{
                backgroundImage: "url('/lovable-uploads/underwater_full.png')",
                backgroundSize: "cover",
                backgroundPosition: "top",
                WebkitMaskImage: "url('/lovable-uploads/dork_health_placeholder_v2.png')",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskSize: "cover",
                maskImage: "url('/lovable-uploads/dork_health_placeholder_v2.png')",
                maskRepeat: "no-repeat",
                maskSize: "cover",
                animation: "hf-drift 8s linear infinite",
              }}
            />
            {/* Subtle brand tint over water */}
            <div className="pointer-events-none absolute inset-0 bg-ocean-teal/25" />
          </div>

          {/* Surface line */}
          <div
            className="absolute left-0 right-0 h-[2px] bg-white/25 transition-all duration-500"
            style={{ bottom: `${waterPct}%` }}
            aria-hidden
          />
        </div>

        {/* Right pane: risk bar + metrics */}
        <div className="grid grid-cols-[40px_1fr] gap-4">
          {/* Vertical risk bar – matches avatar height */}
          <div className="min-h-[220px] lg:min-h-full">
            <RiskBarVertical hf={hf} />
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-3">
              <div className="text-5xl font-semibold text-white leading-none">{hf.toFixed(2)}</div>
              <span className={`text-sm font-medium px-2 py-0.5 rounded-full bg-white/5 ${riskColor}`}>
                {risk}
              </span>
            </div>

            <div className="mt-4 h-[2px] w-40 bg-white/10">
              <div
                className={`h-full transition-all duration-300 ${
                  hf >= 2 ? "bg-teal-400" : hf >= 1.2 ? "bg-yellow-300" : "bg-rose-400"
                }`}
                style={{ width: `${Math.min(100, (hf / 3) * 100)}%` }}
              />
            </div>

            <p className="mt-4 text-sm text-white/60">
              Higher water = higher risk. Add collateral or repay to lower it.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hf-drift {
          from { background-position-x: 0; }
          to   { background-position-x: -50%; }
        }
      `}</style>
    </div>
  );
}
