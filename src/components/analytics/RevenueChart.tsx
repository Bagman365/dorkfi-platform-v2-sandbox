import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartCard from './ChartCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatCurrency } from '@/utils/analyticsUtils';
import { useTheme } from 'next-themes';
import TimeRangeToggle, { TimeRange } from './TimeRangeToggle';

const RevenueChart = () => {
  const { revenueData, loading } = useAnalyticsData();
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');

  if (loading) {
    return (
      <ChartCard title="Revenue Breakdown">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">Loading chart...</div>
        </div>
      </ChartCard>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
          <div className="border-t border-border mt-2 pt-2">
            <p className="text-sm font-medium">
              Total: {formatCurrency(total)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const controls = <TimeRangeToggle value={timeRange} onChange={setTimeRange} />;

  return (
    <ChartCard 
      title="Revenue Breakdown" 
      subtitle="Monthly revenue by source"
      tooltip="Protocol revenue from different sources: interest from lending, liquidation fees, and flash loan fees."
      controls={controls}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value, 0)}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--ocean-teal))', fillOpacity: 0.15 }} />
          <Legend />
          <Bar 
            dataKey="interest" 
            stackId="a" 
            fill="hsl(var(--ocean-teal))" 
            name="Interest"
            radius={[0, 0, 0, 0]}
          />
          <Bar 
            dataKey="liquidations" 
            stackId="a" 
            fill="hsl(var(--whale-gold))" 
            name="Liquidations"
            radius={[0, 0, 0, 0]}
          />
          <Bar 
            dataKey="flashLoans" 
            stackId="a" 
            fill="hsl(var(--highlight-aqua))" 
            name="Flash Loans"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default RevenueChart;