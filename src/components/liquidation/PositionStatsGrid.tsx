
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { getHealthFactorColorClass } from "@/utils/colorUtils";

interface PositionStatsGridProps {
  totalCollateral: number;
  totalBorrowed: number;
  liquidationMargin: number;
  netLTV: number;
  healthFactor: number;
}

const PositionStatsGrid = ({
  totalCollateral,
  totalBorrowed,
  liquidationMargin,
  netLTV,
  healthFactor
}: PositionStatsGridProps) => {
  // Get color classes based on health factor
  const healthFactorColorClass = getHealthFactorColorClass(healthFactor);
  
  // For liquidation margin: higher is better, so we invert the logic
  const liquidationMarginColorClass = healthFactor <= 1.05 ? 'text-red-500' : 
                                     healthFactor <= 1.2 ? 'text-orange-500' : 
                                     healthFactor <= 1.5 ? 'text-yellow-500' : 'text-green-500';
  
  // For Net LTV: lower is better, so high LTV = bad (red), low LTV = good (green)
  const ltvColorClass = netLTV >= 80 ? 'text-red-500' : 
                       netLTV >= 70 ? 'text-orange-500' : 
                       netLTV >= 60 ? 'text-yellow-500' : 'text-green-500';

  return (
    <div className="space-y-4">
      {/* Primary Stats - Collateral & Borrowed */}
      <div className="grid grid-cols-2 gap-4">
        <div className="group p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg">
          <div className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5 mb-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Total Collateral
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3.5 h-3.5 cursor-help opacity-60 hover:opacity-100 transition-opacity" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>The total USD value of all your deposited assets that can be used as collateral for borrowing. Higher collateral increases your borrowing capacity.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 text-center tracking-tight">
            ${totalCollateral.toLocaleString()}
          </div>
        </div>
      
        <div className="group p-5 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-500/30 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg">
          <div className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5 mb-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Total Borrowed
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3.5 h-3.5 cursor-help opacity-60 hover:opacity-100 transition-opacity" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>The total USD value of all your outstanding debt. This amount accrues interest over time and must be repaid to maintain a healthy position.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400 text-center tracking-tight">
            ${totalBorrowed.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Secondary Stats - Risk Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="group p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
          <div className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5 mb-1.5 font-medium">
            Liquidation Margin
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3 h-3 cursor-help opacity-60 hover:opacity-100 transition-opacity" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>The safety buffer between your current position and liquidation. A higher margin means more protection against market volatility and price drops.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className={`text-2xl font-bold ${liquidationMarginColorClass} text-center`}>
            {liquidationMargin.toFixed(1)}%
          </div>
        </div>
      
        <div className="group p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
          <div className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5 mb-1.5 font-medium">
            Net LTV
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3 h-3 cursor-help opacity-60 hover:opacity-100 transition-opacity" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Loan-to-Value ratio shows how much you've borrowed relative to your collateral. Lower LTV = safer position. Most protocols liquidate around 80-85% LTV.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className={`text-2xl font-bold ${ltvColorClass} text-center`}>
            {netLTV.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionStatsGrid;
