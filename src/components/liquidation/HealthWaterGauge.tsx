import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useRiskLevel } from "@/hooks/useRiskLevel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  healthFactor: number;
  avatarSrc?: string;
};

export default function HealthWaterGauge({ healthFactor, avatarSrc }: Props) {
  const hf = Math.max(0.8, Math.min(3.0, healthFactor));
  const riskLevel = useRiskLevel(hf);

  // Map HF -> water height (lower HF = more water)
  // 3.0 -> 10%, 1.2 -> 75%, 0.8 -> 92%
  const waterPct = useMemo(() => {
    const t = (3.0 - hf) / (3.0 - 0.8);
    return Math.round(10 + t * 82);
  }, [hf]);

  // Threshold markers for risk levels
  const thresholds = useMemo(() => [
    { hf: 3.0, label: "Safe", color: "bg-green-500/60" },
    { hf: 1.5, label: "Moderate", color: "bg-yellow-500/60" },
    { hf: 1.2, label: "Caution", color: "bg-orange-500/60" },
    { hf: 1.0, label: "Critical", color: "bg-red-500/60" },
  ], []);

  const getThresholdPosition = (thresholdHf: number) => {
    const t = (3.0 - thresholdHf) / (3.0 - 0.8);
    return Math.round(10 + t * 82);
  };

  return (
    <TooltipProvider>
      <div className="w-full space-y-4 animate-fade-in">
        {/* Header with prominent risk display */}
        <div className="text-xl font-bold text-slate-800 dark:text-white">Health Factor</div>

        {/* Large Risk Score Display */}
        <div className="text-center py-2 px-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200/50 dark:border-slate-700/50 animate-scale-in">
          <div className="text-sm text-muted-foreground mb-1 font-medium">Risk Score</div>
          <div className={`text-5xl font-bold ${riskLevel.color} tracking-tight transition-all duration-300`}>
            {hf.toFixed(2)}
          </div>
        </div>
        
      {/* Water gauge with threshold markers */}
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative h-72 w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#0e1f29] to-[#061218] border-2 border-white/10 shadow-xl cursor-help hover:border-white/20 transition-all duration-300">
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

          {/* Surface line with glow */}
          <div
            className="absolute left-0 right-0 h-[3px] bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-500 z-10"
            style={{ bottom: `${waterPct}%` }}
            aria-hidden
          />

          {/* Risk threshold markers */}
          {thresholds.map((threshold, idx) => {
            const pos = getThresholdPosition(threshold.hf);
            return (
              <div
                key={idx}
                className="absolute left-0 right-0 flex items-center z-20 transition-all duration-500"
                style={{ bottom: `${pos}%` }}
              >
                <div className={`h-[2px] w-8 ${threshold.color}`} />
                <span className="text-[10px] text-white/70 ml-2 font-medium whitespace-nowrap">
                  {threshold.label} ({threshold.hf})
                </span>
              </div>
            );
          })}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <p className="font-medium mb-2">Interactive Risk Gauge</p>
            <p>The water level represents your liquidation risk. Higher water means closer to liquidation.</p>
            <p className="mt-2 text-xs text-muted-foreground">Threshold markers show critical risk levels.</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Contextual guidance */}
      <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-ocean-teal/10 to-sky-blue/10 border border-ocean-teal/20">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          💡 <span className="font-semibold">Quick Tip:</span> Higher water = higher risk. Add collateral or repay debt to lower the water level.
        </p>
      </div>


      <style>{`
        @keyframes hf-drift {
          from { background-position-x: 0; }
          to   { background-position-x: -50%; }
        }
      `}</style>
      </div>
    </TooltipProvider>
  );
}
