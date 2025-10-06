import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis } from 'recharts';
import ChartCard from './ChartCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatCurrency, formatChartDate } from '@/utils/analyticsUtils';
import TimeRangeToggle, { TimeRange } from './TimeRangeToggle';

const TreasuryChart = () => {
  const { treasuryData, loading } = useAnalyticsData();
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');

  if (loading || !treasuryData) {
    return (
      <ChartCard title="Insurance & Treasury">
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

  const SparklineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{formatChartDate(label)}</p>
          <p className="text-sm text-ocean-teal">
            Fund Value: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate fee breakdown and net revenue
  const originationFees = 125000;
  const interestSpreads = 340000;
  const liquidationIncentives = 85000;
  const totalFees = originationFees + interestSpreads + liquidationIncentives;
  const operatingCosts = 120000;
  const netRevenue = totalFees - operatingCosts;

  const feeBreakdown = [
    { name: 'Interest Spreads', value: interestSpreads, color: 'hsl(var(--ocean-teal))' },
    { name: 'Origination Fees', value: originationFees, color: 'hsl(var(--whale-gold))' },
    { name: 'Liquidation Incentives', value: liquidationIncentives, color: 'hsl(var(--reef-purple))' }
  ];

  const controls = <TimeRangeToggle value={timeRange} onChange={setTimeRange} />;

  return (
    <ChartCard 
      title="Insurance & Treasury" 
      subtitle="Protocol revenue & fee income"
      tooltip="Protocol revenue from various fee sources and net income after operating costs."
      controls={controls}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {/* Fee Breakdown Chart */}
        <div className="flex flex-col">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Fee Income Breakdown</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={feeBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {feeBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {feeBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Fee Income</h4>
              <p className="text-3xl font-bold text-ocean-teal">
                {formatCurrency(totalFees)}
              </p>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Operating Costs</span>
                <span className="text-sm font-medium text-red-500">
                  -{formatCurrency(operatingCosts)}
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Net Revenue</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(netRevenue)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Profit Margin</span>
              <span className="text-sm font-bold text-ocean-teal">
                {((netRevenue / totalFees) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
};

export default TreasuryChart;