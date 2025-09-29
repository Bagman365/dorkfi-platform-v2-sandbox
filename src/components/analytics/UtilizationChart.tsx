import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatCurrency, formatPercentage } from '@/utils/analyticsUtils';

const UtilizationChart = () => {
  const { utilizationData, loading } = useAnalyticsData();

  if (loading) {
    return (
      <ChartCard title="Utilization Rates">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">Loading chart...</div>
        </div>
      </ChartCard>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-ocean-teal">
            Supplied: {formatCurrency(data.supplied)}
          </p>
          <p className="text-sm text-whale-gold">
            Borrowed: {formatCurrency(data.borrowed)}
          </p>
          <p className="text-sm font-medium">
            Utilization: {formatPercentage(data.utilization)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard 
      title="Utilization Rates" 
      subtitle="Borrowed vs Supplied by Asset"
      tooltip="Shows how much of each asset is being borrowed relative to what's supplied. Higher utilization indicates strong demand."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={utilizationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/30 dark:stroke-slate-700" />
          <XAxis dataKey="asset" tick={{ fontSize: 12 }} />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value, 0)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="supplied" 
            fill="hsl(var(--ocean-teal))" 
            name="Supplied"
            radius={[0, 0, 4, 4]}
          />
          <Bar 
            dataKey="borrowed" 
            fill="hsl(var(--whale-gold))" 
            name="Borrowed"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default UtilizationChart;