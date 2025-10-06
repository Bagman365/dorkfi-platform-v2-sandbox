import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartCard from './ChartCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatPercentage, formatDateForRange, aggregateWithAverage } from '@/utils/analyticsUtils';
import { useTheme } from 'next-themes';
import TimeRangeToggle, { TimeRange } from './TimeRangeToggle';

const InterestRateChart = () => {
  const { interestRateData, loading } = useAnalyticsData();
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');

  const aggregatedData = useMemo(() => {
    return aggregateWithAverage(
      interestRateData,
      timeRange,
      [],
      ['wethSupply', 'wethBorrow', 'usdcSupply', 'usdcBorrow']
    );
  }, [interestRateData, timeRange]);

  if (loading) {
    return (
      <ChartCard title="Interest Rate Trends">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">Loading chart...</div>
        </div>
      </ChartCard>
    );
  }

  const controls = <TimeRangeToggle value={timeRange} onChange={setTimeRange} />;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{formatDateForRange(label, timeRange)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatPercentage(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard 
      title="Interest Rate Trends" 
      subtitle="Supply vs Borrow APY by asset"
      controls={controls}
      tooltip="Interest rates over time for lending (supply) and borrowing. Dashed lines show supply APY, solid lines show borrow APY."
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={aggregatedData}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatDateForRange(value, timeRange)}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatPercentage(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="wethSupply" 
            stroke="hsl(var(--ocean-teal))" 
            strokeWidth={2}
            name="WETH Supply APY"
            dot={false}
            strokeDasharray="5 5"
          />
          <Line 
            type="monotone" 
            dataKey="wethBorrow" 
            stroke="hsl(var(--ocean-teal))" 
            strokeWidth={2}
            name="WETH Borrow APY"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="usdcSupply" 
            stroke="hsl(var(--whale-gold))" 
            strokeWidth={2}
            name="USDC Supply APY"
            dot={false}
            strokeDasharray="5 5"
          />
          <Line 
            type="monotone" 
            dataKey="usdcBorrow" 
            stroke="hsl(var(--whale-gold))" 
            strokeWidth={2}
            name="USDC Borrow APY"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default InterestRateChart;