import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatPercentage, formatChartDate } from '@/utils/analyticsUtils';
import { useTheme } from 'next-themes';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const InterestRateChart = () => {
  const { interestRateData, loading } = useAnalyticsData();
  const { theme } = useTheme();
  const breakpoint = useBreakpoint();
  
  const bottomMargin = breakpoint === 'mobile' ? 30 : 50;

  if (loading) {
    return (
      <ChartCard title="Interest Rate Trends">
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
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatPercentage(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard 
      title="Interest Rate Trends" 
      subtitle="Supply vs Borrow APY by asset"
      tooltip="Interest rates over time for lending (supply) and borrowing. Dashed lines show supply APY, solid lines show borrow APY."
    >
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={interestRateData} margin={{ top: 5, right: 10, left: -10, bottom: bottomMargin }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={60}
            minTickGap={20}
            interval="preserveStartEnd"
            tickFormatter={(value) => formatChartDate(value)}
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => formatPercentage(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="wethSupply" 
            stroke="hsl(var(--ocean-teal))" 
            strokeWidth={2}
            name="WETH Supply APY"
            dot={false}
            strokeDasharray="5 5"
          />
          <Line 
            type="monotone" 
            dataKey="wethBorrow" 
            stroke="hsl(var(--ocean-teal))" 
            strokeWidth={2}
            name="WETH Borrow APY"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="usdcSupply" 
            stroke="hsl(var(--whale-gold))" 
            strokeWidth={2}
            name="USDC Supply APY"
            dot={false}
            strokeDasharray="5 5"
          />
          <Line 
            type="monotone" 
            dataKey="usdcBorrow" 
            stroke="hsl(var(--whale-gold))" 
            strokeWidth={2}
            name="USDC Borrow APY"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-1 sm:mt-2 flex flex-wrap items-center justify-center gap-1 sm:gap-2 text-[9px] sm:text-xs">
        <div className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: 'hsl(var(--ocean-teal))' }} />
          <span>WETH Borrow APY</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: 'hsl(var(--ocean-teal))' }} />
          <span className="opacity-80">(dashed) WETH Supply APY</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: 'hsl(var(--whale-gold))' }} />
          <span>USDC Borrow APY</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: 'hsl(var(--whale-gold))' }} />
          <span className="opacity-80">(dashed) USDC Supply APY</span>
        </div>
      </div>
    </ChartCard>
  );
};

export default InterestRateChart;