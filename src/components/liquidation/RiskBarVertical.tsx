import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function RiskBarVertical({
  hf,
  className = "",
}: { hf: number; className?: string }) {
  const clamped = Math.max(0.8, Math.min(3.0, hf));
  const bottomPct = ((3.0 - clamped) / (3.0 - 0.8)) * 100;

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-4 ${className}`}>
        {/* Vertical bar with marker */}
        <div className="relative w-6 h-full rounded-full bg-white/10" aria-label={`Risk scale, marker at ${Math.round(bottomPct)}%`}>
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-rose-500 via-yellow-300 to-teal-400 opacity-80" />
          <div
            className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ring-2 ring-white/60 bg-white shadow-lg transition-all duration-500"
            style={{ bottom: `${bottomPct}%` }}
          />
        </div>

        {/* Labels in flex column */}
        <div className="flex flex-col justify-between h-full py-1 hidden sm:flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-xl font-bold text-rose-500 cursor-help transition-colors hover:text-rose-400">
                High Risk
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p className="font-semibold mb-1">High Risk Zone</p>
              <p>Health Factor below 1.2. Your position is at risk of liquidation. Consider adding collateral or repaying debt.</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-xl font-bold text-yellow-500 cursor-help transition-colors hover:text-yellow-400">
                Mid Risk
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p className="font-semibold mb-1">Moderate Risk Zone</p>
              <p>Health Factor between 1.2 and 2.0. Monitor your position and maintain adequate collateral.</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-xl font-bold text-teal-400 cursor-help transition-colors hover:text-teal-300">
                Low Risk
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p className="font-semibold mb-1">Safe Zone</p>
              <p>Health Factor above 2.0. Your position is safe with comfortable collateral margin.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
