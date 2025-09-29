import React, { useMemo } from "react";
import RiskBarVertical from "./RiskBarVertical";
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

  return (
    <TooltipProvider>
      <div className="w-full space-y-4">
        <div className="text-xl font-bold text-slate-800 dark:text-white">Health Factor</div>
        
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Higher water = higher risk. Add collateral or repay to lower the water.
          </p>
        </div>
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

        {/* Vertical gauge with risk score below it */}
        <div className="flex flex-col items-center">
          <RiskBarVertical hf={hf} className="h-full" />
          <div className="mt-2">
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
      </div>

      {/* Dynamic Risk Badge centered under the image */}
      <div className="flex justify-center" style={{ width: '260px' }}>
        <Badge 
          variant={hf <= 1.0 ? 'destructive' : hf <= 1.2 ? 'secondary' : 'outline'}
          className={`${riskLevel.color} ${riskLevel.bg} border-current text-base px-4 py-2 font-bold`}
        >
          {riskLevel.label}
        </Badge>
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
