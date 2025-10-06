import React from 'react';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

const AvgLiquidationSizeCard = () => {
  const { loading } = useAnalyticsData();

  if (loading) {
    return (
      <div className="dorkfi-card-bg rounded-xl border border-border/40 p-6 card-hover">
        <div className="animate-pulse text-center">
          <div className="h-4 bg-muted rounded w-1/2 mx-auto mb-2"></div>
          <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Mock data - in a real scenario, this would come from the analytics hook
  const avgLiquidationSize = 45700;
  const change = 5.2; // +5.2% vs last month

  return (
    <div className="dorkfi-card-bg rounded-xl border border-border/40 p-6 card-hover">
      <div className="text-center">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">
          Average Liquidation Size
        </h3>
        <p className="text-3xl font-bold text-ocean-teal">
          ${(avgLiquidationSize / 1000).toFixed(1)}K
        </p>
        <div className="flex items-center gap-2 justify-center mt-2">
          <div className="flex items-center gap-1 text-xs text-green-600">
            <span>↗</span>
            <span>+{change}%</span>
          </div>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      </div>
    </div>
  );
};

export default AvgLiquidationSizeCard;
