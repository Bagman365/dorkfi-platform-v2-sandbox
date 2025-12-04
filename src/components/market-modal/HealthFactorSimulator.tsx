
import { useState, useMemo } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { MarketData, UserPosition } from './types';
import { cn } from '@/lib/utils';

interface HealthFactorSimulatorProps {
  marketData: MarketData;
  userPosition?: UserPosition;
}

export const HealthFactorSimulator = ({ marketData, userPosition }: HealthFactorSimulatorProps) => {
  const maxBorrowable = userPosition?.borrowable ?? 10000;
  const [borrowAmount, setBorrowAmount] = useState(0);
  
  const currentHF = userPosition?.healthFactor ?? 2.5;
  
  // Simulate new HF based on borrow amount
  const simulatedHF = useMemo(() => {
    if (borrowAmount === 0) return currentHF;
    const collateralValue = userPosition?.supplied ?? 10000;
    const currentBorrow = userPosition?.borrowed ?? 0;
    const newTotalBorrow = currentBorrow + borrowAmount;
    const liquidationThreshold = marketData.liquidationThreshold / 100;
    
    if (newTotalBorrow === 0) return 999;
    return (collateralValue * liquidationThreshold) / newTotalBorrow;
  }, [borrowAmount, currentHF, userPosition, marketData.liquidationThreshold]);

  const getHFColor = (hf: number) => {
    if (hf > 1.5) return 'text-green-500';
    if (hf > 1.0) return 'text-yellow-500';
    return 'text-destructive';
  };

  const getHFBgColor = (hf: number) => {
    if (hf > 1.5) return 'bg-green-500';
    if (hf > 1.0) return 'bg-yellow-500';
    return 'bg-destructive';
  };

  const getRiskLabel = (hf: number) => {
    if (hf > 2.0) return 'Low Risk';
    if (hf > 1.5) return 'Moderate';
    if (hf > 1.0) return 'High Risk';
    return 'Liquidation!';
  };

  return (
    <div className="px-4 sm:px-6 py-4">
      <div className="p-3 sm:p-4 rounded-xl glass-card border border-border/30">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground text-sm sm:text-base">Health Factor Simulator</h3>
        </div>

        {/* Current vs Simulated HF */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          <div className="p-2 sm:p-3 rounded-lg bg-muted/30 text-center">
            <p className="text-xs text-muted-foreground mb-1">Current HF</p>
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <div className={cn("w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full", getHFBgColor(currentHF))} />
              <span className={cn("text-xl sm:text-2xl font-bold", getHFColor(currentHF))}>
                {currentHF.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="p-2 sm:p-3 rounded-lg bg-muted/30 text-center border-2 border-primary/30">
            <p className="text-xs text-muted-foreground mb-1">Simulated HF</p>
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <div className={cn(
                "w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors",
                getHFBgColor(simulatedHF)
              )} />
              <span className={cn(
                "text-xl sm:text-2xl font-bold transition-colors",
                getHFColor(simulatedHF)
              )}>
                {simulatedHF > 100 ? '∞' : simulatedHF.toFixed(2)}
              </span>
            </div>
            <p className={cn("text-xs mt-1", getHFColor(simulatedHF))}>
              {getRiskLabel(simulatedHF)}
            </p>
          </div>
        </div>

        {/* Borrow Amount Slider - touch friendly */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Borrow Amount</span>
            <span className="font-medium text-foreground">${borrowAmount.toLocaleString()}</span>
          </div>
          
          <Slider
            value={[borrowAmount]}
            onValueChange={([value]) => setBorrowAmount(value)}
            max={maxBorrowable}
            step={100}
            className="w-full touch-none"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>Max: ${maxBorrowable.toLocaleString()}</span>
          </div>
        </div>

        {/* Warning if HF drops below threshold */}
        {simulatedHF < 1.2 && simulatedHF > 0 && (
          <div className={cn(
            "mt-4 p-3 rounded-lg flex items-start gap-2",
            simulatedHF < 1.0 ? "bg-destructive/10 border border-destructive/30" : "bg-yellow-500/10 border border-yellow-500/30"
          )}>
            <AlertTriangle className={cn(
              "w-4 h-4 mt-0.5",
              simulatedHF < 1.0 ? "text-destructive" : "text-yellow-500"
            )} />
            <p className={cn(
              "text-sm",
              simulatedHF < 1.0 ? "text-destructive" : "text-yellow-500"
            )}>
              {simulatedHF < 1.0 
                ? "This borrow amount would trigger immediate liquidation!" 
                : "Caution: Low health factor increases liquidation risk."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
