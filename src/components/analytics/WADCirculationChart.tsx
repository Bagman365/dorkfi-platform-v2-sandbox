import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatCurrency, formatPercentage, formatChartDate } from '@/utils/analyticsUtils';

const WADCirculationChart = () => {
  const { wadData, loading } = useAnalyticsData();

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

  const PegTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{formatChartDate(label)}</p>
          <p className="text-sm text-whale-gold">
            Price: ${payload[0].value.toFixed(4)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Supply Growth */}
      <ChartCard title="WAD Supply Growth" className="lg:col-span-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={wadData.supplyData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/30 dark:stroke-slate-700" />
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

      {/* Metrics */}
      <div className="space-y-4">
        {/* Collateralization Ratio Gauge */}
        <div className="dorkfi-card-bg rounded-xl border border-border/40 p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            Collateralization Ratio
          </h4>
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-muted">
              <div 
                className="absolute inset-0 rounded-full border-4 border-ocean-teal transform -rotate-90"
                style={{ 
                  borderRightColor: 'transparent',
                  borderBottomColor: 'transparent',
                  borderLeftColor: wadData.collateralizationRatio > 150 ? 'hsl(var(--ocean-teal))' : 'transparent',
                  borderTopColor: 'hsl(var(--ocean-teal))'
                }}
              />
              <span className="text-lg font-bold text-ocean-teal">
                {formatPercentage(wadData.collateralizationRatio, 0)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Target: &gt;150%</p>
          </div>
        </div>

        {/* Peg Stability Heatmap */}
        <div className="dorkfi-card-bg rounded-xl border border-border/40 p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            Peg Stability (30d)
          </h4>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={wadData.pegStability}>
              <XAxis dataKey="date" hide />
              <YAxis 
                domain={[0.98, 1.02]}
                hide 
              />
              <Tooltip content={<PegTooltip />} />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(var(--whale-gold))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-2">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>$0.998-$1.002</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-whale-gold rounded-full" />
                <span>Current</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WADCirculationChart;