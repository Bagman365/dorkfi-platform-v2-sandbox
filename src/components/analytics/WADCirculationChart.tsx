import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatCurrency, formatChartDate } from '@/utils/analyticsUtils';
import { useTheme } from 'next-themes';

const WADCirculationChart = () => {
  const { wadData, loading } = useAnalyticsData();
  const { theme } = useTheme();

  if (loading || !wadData) {
    return (
      <ChartCard title="WAD Circulation">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">Loading chart...</div>
        </div>
      </ChartCard>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{formatChartDate(label)}</p>
          <p className="text-sm text-ocean-teal">
            Supply: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };


  return (
    <ChartCard title="WAD Supply Growth">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={wadData.supplyData}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatChartDate(value)}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value, 0)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="supply" 
            stroke="hsl(var(--ocean-teal))" 
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default WADCirculationChart;