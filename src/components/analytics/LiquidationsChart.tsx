import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatCurrency, formatChartDate } from '@/utils/analyticsUtils';

const LiquidationsChart = () => {
  const { liquidationData, loading } = useAnalyticsData();

  if (loading || !liquidationData) {
    return (
      <ChartCard title="Liquidations">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">Loading chart...</div>
        </div>
      </ChartCard>
    );
  }

  const ScatterTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{formatChartDate(data.date)}</p>
          <p className="text-sm text-ocean-teal">
            Volume: {formatCurrency(data.volume)}
          </p>
          <p className="text-sm text-whale-gold">
            Events: {data.count}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard 
      title="Liquidation Events" 
      subtitle="Daily volume & count (30 days)"
      tooltip="Scatter plot showing daily liquidation events. Dot size represents volume, position shows frequency over time."
    >
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart data={liquidationData.events}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => formatChartDate(value)}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value, 0)}
          />
          <Tooltip content={<ScatterTooltip />} />
          <Scatter 
            dataKey="volume" 
            fill="hsl(var(--ocean-teal))"
            fillOpacity={0.7}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default LiquidationsChart;