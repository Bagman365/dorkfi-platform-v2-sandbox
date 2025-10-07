import React from 'react';
import KPICard from './KPICard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatCurrency, formatNumber } from '@/utils/analyticsUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getTokenImagePath } from '@/utils/tokenImageUtils';

const KPIGrid = () => {
  const { kpiData, loading } = useAnalyticsData();

  if (loading || !kpiData) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 animate-fade-in">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 animate-fade-in">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <KPICard
                title="Total Value Locked"
                value={formatCurrency(kpiData.tvl)}
                change={5.4}
                icon="📊"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Total Value Locked - The total value of all assets deposited in the protocol</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <KPICard
                title="Total Borrowed"
                value={formatCurrency(kpiData.totalBorrowed)}
                change={3.2}
                icon="💰"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Total amount of assets currently borrowed from the protocol across all markets</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <KPICard
                title="WAD Circulation"
                value={formatCurrency(kpiData.wadCirculation)}
                change={2.1}
                iconImage={getTokenImagePath('WAD')}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Total supply of WAD tokens in circulation - DorkFi's native stablecoin</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <KPICard
                title="Protocol Revenue"
                value={formatCurrency(kpiData.protocolRevenue)}
                subtitle="MTD"
                change={8.7}
                icon="📈"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Month-to-date revenue from interest, liquidations, and flash loan fees</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <KPICard
                title="Active Wallets"
                value={formatNumber(kpiData.activeWallets)}
                subtitle="MAU"
                change={12.3}
                icon="👥"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Monthly Active Users - Unique wallets that interacted with the protocol this month</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default KPIGrid;