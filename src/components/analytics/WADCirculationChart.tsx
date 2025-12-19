import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import { Button } from '@/components/ui/button';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatCurrency, formatChartDate } from '@/utils/analyticsUtils';
import { useTheme } from 'next-themes';

const WADCirculationChart = () => {
  const { wadData, loading } = useAnalyticsData();
  const { theme } = useTheme();
  const [network, setNetwork] = useState<'total' | 'algo' | 'voi'>('total');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  if (loading || !wadData) {
    return (
      <ChartCard title="WAD Supply Growth">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">Loading chart...</div>
        </div>
      </ChartCard>
    );
  }

  const controls = (
    <div className="flex flex-col gap-2 items-end">
      <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
        {(['total', 'algo', 'voi'] as const).map((net) => (
          <Button
            key={net}
            size="sm"
            variant={network === net ? 'default' : 'ghost'}
            onClick={() => setNetwork(net)}
            className="text-xs h-7 px-3"
          >
            {net === 'total' ? 'Total' : net.toUpperCase()}
          </Button>
        ))}
      </div>
      <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
        {(['7d', '30d', '90d'] as const).map((range) => (
          <Button
            key={range}
            size="sm"
            variant={timeRange === range ? 'default' : 'ghost'}
            onClick={() => setTimeRange(range)}
            className="text-xs h-7 px-3"
          >
            {range === '7d' ? '7D' : range === '30d' ? '30D' : '90D'}
          </Button>
        ))}
      </div>
    </div>
  );

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
    <ChartCard title="WAD Supply Growth" controls={controls}>
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