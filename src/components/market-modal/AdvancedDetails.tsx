
import { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, Database, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { MarketData } from './types';
import { cn } from '@/lib/utils';

interface AdvancedDetailsProps {
  marketData: MarketData;
}

export const AdvancedDetails = ({ marketData }: AdvancedDetailsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock rate curve data (kink model)
  const rateCurveData = Array.from({ length: 100 }, (_, i) => {
    const utilization = i;
    const kink = 80;
    const baseRate = 2;
    const slope1 = 4;
    const slope2 = 75;
    
    let rate: number;
    if (utilization <= kink) {
      rate = baseRate + (utilization / kink) * slope1;
    } else {
      rate = baseRate + slope1 + ((utilization - kink) / (100 - kink)) * slope2;
    }
    return { utilization, rate };
  });

  const spreadBreakdown = [
    { label: 'Base Rate', value: '2.00%' },
    { label: 'Slope 1 (≤80%)', value: '4.00%' },
    { label: 'Slope 2 (>80%)', value: '75.00%' },
    { label: 'Reserve Factor', value: `${marketData.reserveFactor}%` },
  ];

  return (
    <div className="px-4 sm:px-6 py-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl glass-card border border-border/30 hover:border-primary/30 transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground text-sm sm:text-base">Advanced Details</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"
      )}>
        <div className="space-y-3 sm:space-y-4">
          {/* Interest Rate Curve */}
          <div className="p-3 sm:p-4 rounded-xl glass-card border border-border/30">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h4 className="font-medium text-foreground text-sm sm:text-base">Interest Rate Curve</h4>
            </div>
            <div className="h-32 sm:h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rateCurveData}>
                  <XAxis 
                    dataKey="utilization" 
                    tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(v) => `${v}%`}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(v) => `${v}%`}
                    width={35}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#21EFA3" 
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-2 text-[10px] sm:text-xs text-muted-foreground">
              <span>Utilization: 0%</span>
              <span className="text-yellow-500">Kink: 80%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Spread Breakdown */}
          <div className="p-3 sm:p-4 rounded-xl glass-card border border-border/30">
            <h4 className="font-medium text-foreground mb-3 text-sm sm:text-base">Rate Parameters</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {spreadBreakdown.map((item) => (
                <div key={item.label} className="flex justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="text-xs font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Market Caps */}
          <div className="p-3 sm:p-4 rounded-xl glass-card border border-border/30">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-4 h-4 text-primary" />
              <h4 className="font-medium text-foreground text-sm sm:text-base">Market Caps</h4>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs sm:text-sm mb-1">
                  <span className="text-muted-foreground">Supply Cap</span>
                  <span className="text-foreground truncate ml-2">
                    ${marketData.totalSupply.toLocaleString()} / ${marketData.supplyCap.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(marketData.totalSupply / marketData.supplyCap) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs sm:text-sm mb-1">
                  <span className="text-muted-foreground">Borrow Cap</span>
                  <span className="text-foreground truncate ml-2">
                    ${marketData.totalBorrow.toLocaleString()} / ${marketData.borrowCap.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${(marketData.totalBorrow / marketData.borrowCap) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
