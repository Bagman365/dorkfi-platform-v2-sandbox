import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ChartCard from './ChartCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatNumber } from '@/utils/analyticsUtils';

const HealthFactorChart = () => {
  const { healthFactorData, loading } = useAnalyticsData();

  if (loading) {
    return (
      <ChartCard title="Health Factor Distribution">
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
          <p className="font-medium">Health Factor: {label}</p>
          <p className="text-sm">
            Accounts: {formatNumber(data.count)}
          </p>
          <p className="text-xs text-muted-foreground">
            {label === '<1.0' && 'Liquidatable positions'}
            {label === '1.0-1.1' && 'High risk positions'}
            {label === '1.1-1.2' && 'Medium risk positions'}
            {label === '1.2-1.5' && 'Low risk positions'}
            {label === '>1.5' && 'Safe positions'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard 
      title="Health Factor Distribution" 
      subtitle="Borrower risk levels (<1.0 highlighted)"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={healthFactorData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="range" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatNumber(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="count" 
            radius={[4, 4, 0, 0]}
          >
            {healthFactorData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Risk Summary */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
        {healthFactorData.map((item, index) => (
          <div key={index} className="text-center p-2 rounded-lg bg-muted/50">
            <div 
              className="w-3 h-3 rounded-full mx-auto mb-1" 
              style={{ backgroundColor: item.color }}
            />
            <p className="font-medium">{item.range}</p>
            <p className="text-muted-foreground">{formatNumber(item.count)}</p>
          </div>
        ))}
      </div>
    </ChartCard>
  );
};

export default HealthFactorChart;