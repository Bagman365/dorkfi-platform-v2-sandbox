import React, { useMemo } from "react";

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

  const risk =
    hf >= 2.0 ? "Low Risk" : hf >= 1.2 ? "Mid Risk" : "High Risk";

  return (
    <div className="w-full space-y-4">
      <div className="text-sm text-muted-foreground">Health Factor</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Visual card */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#0e1f29] border border-white/10">
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

        {/* Numbers & copy */}
        <div className="flex flex-col gap-3">
          <div className="text-4xl font-semibold text-foreground">{hf.toFixed(2)}</div>
        <div
          className={`text-lg font-medium ${
            hf >= 2.0 ? "text-ocean-teal" : hf >= 1.2 ? "text-whale-gold" : "text-destructive"
          }`}
        >
          {risk}
        </div>
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              hf >= 2.0 ? "bg-ocean-teal" : hf >= 1.2 ? "bg-whale-gold" : "bg-destructive"
            }`}
            style={{ width: `${Math.min(100, (hf / 3.0) * 100)}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          High risk submerges the avatar. Add collateral or repay to lower the water.
        </p>
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
