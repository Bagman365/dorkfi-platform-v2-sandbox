import React, { useState, useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import ChartCard from './ChartCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { useTheme } from 'next-themes';
import TimeRangeToggle, { TimeRange } from './TimeRangeToggle';
import { aggregateWithAverage, formatDateForRange } from '@/utils/analyticsUtils';

const WithdrawalsChart = () => {
  const { withdrawalsData, loading } = useAnalyticsData();
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');

  const aggregatedData = useMemo(() => {
    return aggregateWithAverage(withdrawalsData, timeRange, ['amount']);
  }, [withdrawalsData, timeRange]);

  const totalWithdrawals = useMemo(() => 
    aggregatedData.reduce((sum, d) => sum + (d.amount || 0), 0),
    [aggregatedData]
  );

  const formattedTotal = `$${(totalWithdrawals / 1_000_000).toFixed(1)}M`;

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
        title="Withdrawals" 
        subtitle={`Total withdrawals: ${formattedTotal}`}
        tooltip="Monitor withdrawal activity to track user outflows and liquidity patterns"
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
      title="Withdrawals" 
      subtitle={`Total withdrawals: ${formattedTotal}`}
      tooltip="Monitor withdrawal activity to track user outflows and liquidity patterns"
      controls={controls}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'} />
          <defs>
            <linearGradient id="withdrawalsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--whale-gold))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--whale-gold))" stopOpacity={0}/>
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
            formatter={(value: number) => [`$${value.toFixed(2)}M`, 'Withdrawals']}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="hsl(var(--whale-gold))"
            strokeWidth={2}
            fill="url(#withdrawalsGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default WithdrawalsChart;
