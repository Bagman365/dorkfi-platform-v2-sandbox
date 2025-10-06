import React, { useState, useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import ChartCard from './ChartCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { useTheme } from 'next-themes';
import TimeRangeToggle, { TimeRange } from './TimeRangeToggle';
import { aggregateWithAverage, formatDateForRange } from '@/utils/analyticsUtils';

const DepositsChart = () => {
  const { depositsData, loading } = useAnalyticsData();
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');

  const aggregatedData = useMemo(() => {
    return aggregateWithAverage(depositsData, timeRange, ['amount']);
  }, [depositsData, timeRange]);

  const totalDeposits = useMemo(() => 
    aggregatedData.reduce((sum, d) => sum + (d.amount || 0), 0),
    [aggregatedData]
  );

  const formattedTotal = `$${(totalDeposits / 1_000_000).toFixed(1)}M`;

  const chartData = useMemo(() => 
    aggregatedData.map(d => ({
      date: d.date,
      amount: (d.amount || 0) / 1_000_000,
    })),
    [aggregatedData]
  );

  if (loading) {
    return (
      <ChartCard 
        title="Deposits" 
        subtitle={`Total deposits: ${formattedTotal}`}
        tooltip="Track deposit volume to monitor user inflows and protocol growth"
      >
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </ChartCard>
    );
  }

  const controls = <TimeRangeToggle value={timeRange} onChange={setTimeRange} />;

  return (
    <ChartCard 
      title="Deposits" 
      subtitle={`Total deposits: ${formattedTotal}`}
      tooltip="Track deposit volume to monitor user inflows and protocol growth"
      controls={controls}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'} />
          <defs>
            <linearGradient id="depositsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--ocean-teal))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--ocean-teal))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => formatDateForRange(value, timeRange)}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => `$${value.toFixed(1)}M`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}M`, 'Deposits']}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="hsl(var(--ocean-teal))"
            strokeWidth={2}
            fill="url(#depositsGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default DepositsChart;
