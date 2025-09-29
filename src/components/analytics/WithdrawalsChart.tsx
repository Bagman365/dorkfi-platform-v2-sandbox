import React from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import ChartCard from './ChartCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

const WithdrawalsChart = () => {
  const { withdrawalsData, loading } = useAnalyticsData();

  if (loading) {
    return (
      <ChartCard 
        title="Withdrawals" 
        subtitle={`Total withdrawals: $${(189.3).toFixed(1)}M`}
        tooltip="Monitor daily withdrawal activity to track user outflows and liquidity patterns"
      >
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </ChartCard>
    );
  }

  const totalWithdrawals = withdrawalsData.reduce((sum, d) => sum + d.amount, 0);
  const formattedTotal = `$${(totalWithdrawals / 1_000_000).toFixed(1)}M`;

  const chartData = withdrawalsData.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount: d.amount / 1_000_000,
  }));

  return (
    <ChartCard 
      title="Withdrawals" 
      subtitle={`Total withdrawals: ${formattedTotal}`}
      tooltip="Monitor daily withdrawal activity to track user outflows and liquidity patterns"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
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
