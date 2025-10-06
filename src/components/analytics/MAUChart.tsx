import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartCard from './ChartCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatNumber } from '@/utils/analyticsUtils';
import { useTheme } from 'next-themes';
import TimeRangeToggle, { TimeRange } from './TimeRangeToggle';

const MAUChart = () => {
  const { mauData, loading } = useAnalyticsData();
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');

  if (loading) {
    return (
      <ChartCard title="Monthly Active Users">
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
              {entry.name}: {formatNumber(entry.value)}
            </p>
          ))}
          <div className="border-t border-border mt-2 pt-2">
            <p className="text-sm font-medium">
              Total: {formatNumber(total)}
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
      title="Monthly Active Users" 
      subtitle="User engagement by activity type"
      tooltip="Shows monthly active users broken down by activity: lending, borrowing, and staking. Indicates protocol adoption and usage patterns."
      controls={controls}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={mauData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatNumber(value)}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--ocean-teal))', fillOpacity: 0.15 }} />
          <Legend />
          <Bar 
            dataKey="lenders" 
            stackId="a" 
            fill="hsl(var(--ocean-teal))" 
            name="Lenders"
            radius={[0, 0, 0, 0]}
          />
          <Bar 
            dataKey="borrowers" 
            stackId="a" 
            fill="hsl(var(--whale-gold))" 
            name="Borrowers"
            radius={[0, 0, 0, 0]}
          />
          <Bar 
            dataKey="stakers" 
            stackId="a" 
            fill="hsl(var(--highlight-aqua))" 
            name="Stakers"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default MAUChart;