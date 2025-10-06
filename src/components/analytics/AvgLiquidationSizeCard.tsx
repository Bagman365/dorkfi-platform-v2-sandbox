import React from 'react';
import KPICard from './KPICard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

const AvgLiquidationSizeCard = () => {
  const { loading } = useAnalyticsData();

  if (loading) {
    return (
      <div className="dorkfi-card-bg rounded-xl border border-border/40 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Mock data - in a real scenario, this would come from the analytics hook
  const avgLiquidationSize = 45700;
  const change = 5.2; // +5.2% vs last month

  return (
    <KPICard
      title="Average Liquidation Size"
      value={`$${(avgLiquidationSize / 1000).toFixed(1)}K`}
      change={change}
      subtitle="vs last month"
      icon="⚡"
    />
  );
};

export default AvgLiquidationSizeCard;
