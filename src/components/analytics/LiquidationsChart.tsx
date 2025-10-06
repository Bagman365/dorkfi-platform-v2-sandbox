import React, { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatCurrency, formatDateForRange, aggregateWithAverage } from '@/utils/analyticsUtils';
import { useTheme } from 'next-themes';
import TimeRangeToggle, { TimeRange } from './TimeRangeToggle';

const LiquidationsChart = () => {
  const { liquidationData, loading } = useAnalyticsData();
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');

  const aggregatedEvents = useMemo(() => {
    if (!liquidationData) return [];
    return aggregateWithAverage(liquidationData.events, timeRange, ['volume', 'count']);
  }, [liquidationData, timeRange]);

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
          <p className="font-medium">{formatDateForRange(data.date, timeRange)}</p>
          <p className="text-sm text-ocean-teal">
            Volume: {formatCurrency(data.volume)}
          </p>
          <p className="text-sm text-whale-gold">
            Events: {Math.round(data.count)}
          </p>
        </div>
      );
    }
    return null;
  };

  const controls = <TimeRangeToggle value={timeRange} onChange={setTimeRange} />;

  return (
    <ChartCard 
      title="Liquidation Events" 
      subtitle={`Volume & count (${timeRange})`}
      tooltip="Scatter plot showing liquidation events. Dot size represents volume, position shows frequency over time."
      className="h-auto"
      controls={controls}
    >
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart data={aggregatedEvents}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => formatDateForRange(value, timeRange)}
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
      </div>
    </ChartCard>
  );
};

export default LiquidationsChart;