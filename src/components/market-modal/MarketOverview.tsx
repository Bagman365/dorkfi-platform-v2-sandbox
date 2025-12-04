
import { Info } from 'lucide-react';
import { MarketData } from './types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface MarketOverviewProps {
  marketData: MarketData;
}

export const MarketOverview = ({ marketData }: MarketOverviewProps) => {
  const utilizationColor = marketData.utilization < 50 
    ? 'bg-green-500' 
    : marketData.utilization < 85 
      ? 'bg-yellow-500' 
      : 'bg-destructive';

  const utilizationTextColor = marketData.utilization < 50 
    ? 'text-green-500' 
    : marketData.utilization < 85 
      ? 'text-yellow-500' 
      : 'text-destructive';

  return (
    <div className="px-4 sm:px-6 py-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Available Liquidity */}
        <div className="p-3 sm:p-4 rounded-xl glass-card border border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">Available Liquidity</p>
          <p className="text-xl sm:text-2xl font-bold text-foreground">
            ${marketData.availableLiquidity.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            {((marketData.availableLiquidity / marketData.totalSupply) * 100).toFixed(1)}% of supply
          </p>
        </div>

        {/* Total Supplied */}
        <div className="p-3 sm:p-4 rounded-xl glass-card border border-green-500/20">
          <p className="text-xs text-muted-foreground mb-1">Total Supplied</p>
          <p className="text-xl sm:text-2xl font-bold text-green-500">
            ${marketData.totalSupply.toLocaleString()}
          </p>
          <p className="text-xs text-green-500/80">
            {marketData.supplyAPY.toFixed(2)}% APY
          </p>
        </div>

        {/* Total Borrowed */}
        <div className="p-3 sm:p-4 rounded-xl glass-card border border-orange-500/20">
          <p className="text-xs text-muted-foreground mb-1">Total Borrowed</p>
          <p className="text-xl sm:text-2xl font-bold text-orange-500">
            ${marketData.totalBorrow.toLocaleString()}
          </p>
          <p className="text-xs text-orange-500/80">
            {marketData.borrowAPY.toFixed(2)}% APY
          </p>
        </div>
      </div>

      {/* Utilization Bar */}
      <div className="p-4 rounded-xl glass-card border border-border/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">Utilization Rate</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Higher utilization leads to higher borrow APY and supply APY. When utilization exceeds the optimal rate (80%), rates increase sharply.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className={cn("text-lg font-bold", utilizationTextColor)}>
            {marketData.utilization.toFixed(1)}%
          </span>
        </div>
        
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-500", utilizationColor)}
            style={{ width: `${marketData.utilization}%` }}
          />
        </div>

        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>0%</span>
          <span className="text-yellow-500">Optimal: 80%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};
