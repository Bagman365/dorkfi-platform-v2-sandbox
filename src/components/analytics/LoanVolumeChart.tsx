import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartCard from './ChartCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatCurrency, formatChartDate } from '@/utils/analyticsUtils';

const LoanVolumeChart = () => {
  const { loanData, loading } = useAnalyticsData();

  if (loading || !loanData) {
    return (
      <ChartCard title="Loan Volume vs Repayments">
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
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
    <ChartCard 
      title="Loan Volume vs Repayments" 
      subtitle="Daily lending activity"
      tooltip="Daily volume of new loans versus repayments. Shows lending activity and liquidity flow patterns."
    >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={loanData.volume}>
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
            <Legend />
            <Line 
              type="monotone" 
              dataKey="loans" 
              stroke="hsl(var(--ocean-teal))" 
              strokeWidth={2}
              name="New Loans"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="repayments" 
              stroke="hsl(var(--whale-gold))" 
              strokeWidth={2}
              name="Repayments"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Average Loan Size Card */}
      <div className="dorkfi-card-bg rounded-xl border border-border/40 p-6 card-hover">
        <div className="text-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Average Loan Size
          </h3>
          <p className="text-3xl font-bold text-ocean-teal">
            {formatCurrency(loanData.avgLoanSize)}
          </p>
          <div className="flex items-center gap-2 justify-center mt-2">
            <div className="flex items-center gap-1 text-xs text-green-600">
              <span>↗</span>
              <span>+5.2%</span>
            </div>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanVolumeChart;