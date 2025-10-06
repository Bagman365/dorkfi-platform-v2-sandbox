import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import ChartCard from './ChartCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatCurrency } from '@/utils/analyticsUtils';
import TimeRangeToggle, { TimeRange } from './TimeRangeToggle';

const AssetDistributionChart = () => {
  const { assetDistribution, loading } = useAnalyticsData();
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');

  if (loading || !assetDistribution) {
    return (
      <ChartCard title="Asset Distribution">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">Loading chart...</div>
        </div>
      </ChartCard>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">
            Value: {formatCurrency(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const controls = <TimeRangeToggle value={timeRange} onChange={setTimeRange} />;

  return (
    <ChartCard 
      title="Asset Distribution" 
      subtitle="Deposits vs Borrows by asset"
      tooltip="Distribution of deposits and borrows across different assets. Shows which assets are most popular for lending and borrowing."
      controls={controls}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {/* Deposits Chart */}
        <div className="flex flex-col">
          <h4 className="text-sm font-medium text-muted-foreground mb-4 text-center">
            Deposits
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={assetDistribution.deposits}
                cx="50%"
                cy="50%"
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {assetDistribution.deposits.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {assetDistribution.deposits.map((item, index) => (
              <div key={index} className="flex items-center gap-1 text-xs">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Borrows Chart */}
        <div className="flex flex-col">
          <h4 className="text-sm font-medium text-muted-foreground mb-4 text-center">
            Borrows
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={assetDistribution.borrows}
                cx="50%"
                cy="50%"
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {assetDistribution.borrows.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {assetDistribution.borrows.map((item, index) => (
              <div key={index} className="flex items-center gap-1 text-xs">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ChartCard>
  );
};

export default AssetDistributionChart;