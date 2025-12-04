
import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, TrendingDown } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { MarketData } from './types';
import { cn } from '@/lib/utils';

interface EarningsCalculatorProps {
  marketData: MarketData;
}

type TimePeriod = '1M' | '6M' | '1Y';

export const EarningsCalculator = ({ marketData }: EarningsCalculatorProps) => {
  const [amount, setAmount] = useState(1000);
  const [period, setPeriod] = useState<TimePeriod>('1Y');

  const periodMonths: Record<TimePeriod, number> = {
    '1M': 1,
    '6M': 6,
    '1Y': 12,
  };

  const { supplyEarnings, borrowCost } = useMemo(() => {
    const months = periodMonths[period];
    const years = months / 12;
    
    // Compound interest calculation
    const supplyRate = marketData.supplyAPY / 100;
    const borrowRate = marketData.borrowAPY / 100;
    
    const supplyEarnings = amount * (Math.pow(1 + supplyRate, years) - 1);
    const borrowCost = amount * (Math.pow(1 + borrowRate, years) - 1);
    
    return { supplyEarnings, borrowCost };
  }, [amount, period, marketData.supplyAPY, marketData.borrowAPY]);

  return (
    <div className="px-4 sm:px-6 py-4">
      <div className="p-3 sm:p-4 rounded-xl glass-card border border-border/30">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Earnings Calculator</h3>
        </div>

        {/* Amount Input */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium text-foreground">${amount.toLocaleString()}</span>
          </div>
          
          <Slider
            value={[amount]}
            onValueChange={([value]) => setAmount(value)}
            min={100}
            max={100000}
            step={100}
            className="w-full touch-none"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$100</span>
            <span>$100,000</span>
          </div>
        </div>

        {/* Time Period Selector - touch friendly */}
        <div className="flex gap-2 mb-6">
          {(['1M', '6M', '1Y'] as TimePeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "flex-1 py-3 sm:py-2 px-3 sm:px-4 rounded-lg text-sm font-medium transition-all active:scale-95",
                period === p
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              <span className="hidden sm:inline">{p === '1M' ? '1 Month' : p === '6M' ? '6 Months' : '1 Year'}</span>
              <span className="sm:hidden">{p}</span>
            </button>
          ))}
        </div>

        {/* Results Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-xl bg-green-500/10 border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-500/80">If Supplying</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-green-500">
              +${supplyEarnings.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              at {marketData.supplyAPY.toFixed(2)}% APY
            </p>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-orange-500/80">If Borrowing</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-orange-500">
              -${borrowCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              at {marketData.borrowAPY.toFixed(2)}% APY
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Calculations assume compounding interest. Actual results may vary.
        </p>
      </div>
    </div>
  );
};
