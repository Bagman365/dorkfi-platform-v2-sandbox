import React from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import ChartCard from './ChartCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

const DepositsChart = () => {
  const { depositsData, loading } = useAnalyticsData();

  if (loading) {
    return (
      <ChartCard 
        title="Deposits" 
        subtitle={`Total deposits: $${(245.7).toFixed(1)}M`}
        tooltip="Track daily deposit volume to monitor user inflows and protocol growth"
      >
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </ChartCard>
    );
  }

  const totalDeposits = depositsData.reduce((sum, d) => sum + d.amount, 0);
  const formattedTotal = `$${(totalDeposits / 1_000_000).toFixed(1)}M`;

  const chartData = depositsData.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount: d.amount / 1_000_000,
  }));

  return (
    <ChartCard 
      title="Deposits" 
      subtitle={`Total deposits: ${formattedTotal}`}
      tooltip="Track daily deposit volume to monitor user inflows and protocol growth"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
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
