import React, { useState, useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartCard from './ChartCard';
import { Button } from '@/components/ui/button';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatCurrency, formatDateForRange, aggregateWithAverage } from '@/utils/analyticsUtils';
import { useTheme } from 'next-themes';
import TimeRangeToggle, { TimeRange } from './TimeRangeToggle';

const TVLChart = () => {
  const { tvlData, loading } = useAnalyticsData();
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<'total' | 'stacked'>('total');
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');

  const aggregatedData = useMemo(() => {
    return aggregateWithAverage(
      tvlData,
      timeRange,
      ['total', 'weth', 'usdc', 'usdt', 'wbtc']
    );
  }, [tvlData, timeRange]);

  if (loading) {
    return (
      <ChartCard title="TVL Growth">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">Loading chart...</div>
        </div>
      </ChartCard>
    );
  }

  const controls = (
    <div className="flex gap-3">
      <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={viewMode === 'total' ? 'default' : 'outline'}
          onClick={() => setViewMode('total')}
          className="text-xs"
        >
          Total
        </Button>
        <Button
          size="sm"
          variant={viewMode === 'stacked' ? 'default' : 'outline'}
          onClick={() => setViewMode('stacked')}
          className="text-xs"
        >
          By Asset
        </Button>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{formatDateForRange(label, timeRange)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard 
      title="TVL Growth" 
      controls={controls}
      tooltip="Shows the total value locked in the protocol over time. Toggle between total view and per-asset breakdown."
    >
      <ResponsiveContainer width="100%" height="100%">
        {viewMode === 'total' ? (
          <LineChart data={aggregatedData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatDateForRange(value, timeRange)}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatCurrency(value, 0)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="hsl(var(--ocean-teal))" 
              strokeWidth={3}
              name="Total TVL"
              dot={false}
            />
          </LineChart>
        ) : (
          <AreaChart data={aggregatedData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatDateForRange(value, timeRange)}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatCurrency(value, 0)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="weth" 
              stackId="1" 
              stroke="hsl(var(--ocean-teal))" 
              fill="hsl(var(--ocean-teal))"
              name="WETH"
            />
            <Area 
              type="monotone" 
              dataKey="usdc" 
              stackId="1" 
              stroke="hsl(var(--whale-gold))" 
              fill="hsl(var(--whale-gold))"
              name="USDC"
            />
            <Area 
              type="monotone" 
              dataKey="usdt" 
              stackId="1" 
              stroke="hsl(var(--highlight-aqua))" 
              fill="hsl(var(--highlight-aqua))"
              name="USDT"
            />
            <Area 
              type="monotone" 
              dataKey="wbtc" 
              stackId="1" 
              stroke="hsl(var(--accent))" 
              fill="hsl(var(--accent))"
              name="WBTC"
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default TVLChart;