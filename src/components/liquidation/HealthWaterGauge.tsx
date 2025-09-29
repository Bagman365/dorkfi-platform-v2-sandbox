import React, { useMemo } from "react";
import RiskBarVertical from "./RiskBarVertical";
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

  // Map HF -> water height (lower HF = more water)
  // 3.0 -> 10%, 1.2 -> 75%, 0.8 -> 92%
  const waterPct = useMemo(() => {
    const t = (3.0 - hf) / (3.0 - 0.8);
    return Math.round(10 + t * 82);
  }, [hf]);

  const risk =
    hf >= 2.0 ? "Low Risk" : hf >= 1.2 ? "Mid Risk" : "High Risk";

  return (
    <TooltipProvider>
      <div className="w-full space-y-4">
        <div className="text-xl font-bold text-slate-800 dark:text-white">Health Factor</div>
      
      {/* Fixed-height row to lock bar and avatar alignment */}
      <div className="flex items-stretch gap-4 h-56 md:h-64">
        {/* Avatar with water overlay also fills height */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative h-full w-[260px] md:w-[300px] rounded-2xl overflow-hidden bg-[#0e1f29] border border-white/10 cursor-help">
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
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p>The water level represents your liquidation risk. Higher water means your position is closer to liquidation.</p>
          </TooltipContent>
        </Tooltip>

        {/* Vertical gauge matches parent height */}
        <RiskBarVertical hf={hf} className="h-full" />
      </div>

      {/* Metrics block */}
      <div className="mt-5 flex justify-end">
        <div className="flex items-baseline gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full bg-white/5 cursor-help ${
                  hf >= 2.0 ? "text-ocean-teal" : hf >= 1.2 ? "text-whale-gold" : "text-destructive"
                }`}
              >
                {risk}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>
                {hf >= 2.0 
                  ? "Low Risk: Your position is safe" 
                  : hf >= 1.2 
                  ? "Mid Risk: Monitor your position closely" 
                  : "High Risk: Your position may be liquidated soon"}
              </p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-lg font-semibold text-foreground cursor-help">Risk Score: {hf.toFixed(2)}</div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p>Health Factor shows how safe your position is. Below 1.0 means you can be liquidated. Higher is safer.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-sm text-muted-foreground text-center">
          Higher water = higher risk. Add collateral or repay to lower the water.
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
