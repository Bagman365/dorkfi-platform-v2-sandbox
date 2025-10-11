
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import LiquidationPrice from "./LiquidationPrice";

interface HealthFactorActionsProps {
  healthFactor: number;
  onAddCollateral: () => void;
  onBuyVoi: () => void;
  borrowedAmount?: number;
  collateralAmount?: number;
  liquidationThresholdBps?: number;
  collateralSymbol?: string;
}

const HealthFactorActions = ({
  healthFactor,
  onAddCollateral,
  onBuyVoi,
  borrowedAmount,
  collateralAmount,
  liquidationThresholdBps,
  collateralSymbol
}: HealthFactorActionsProps) => {
  const isPrimaryAction = healthFactor <= 1.2;

  return (
    <>
      {/* Liquidation Price Display */}
      {borrowedAmount && collateralAmount && liquidationThresholdBps && (
        <LiquidationPrice
          borrowedAmount={borrowedAmount}
          collateralAmount={collateralAmount}
          liquidationThresholdBps={liquidationThresholdBps}
          collateralSymbol={collateralSymbol}
        />
      )}

      {/* Risk Warning - Show at top if critical */}
      {healthFactor <= 1.2 && (
        <div className={`p-4 rounded-xl ${
          healthFactor <= 1 
            ? 'bg-gradient-to-r from-red-500/30 to-red-600/30 border-2 border-red-500 animate-pulse' 
            : 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-2 border-orange-500/50'
        } backdrop-blur-sm`}>
          <div className="flex items-start gap-3">
            <div className={`w-3 h-3 mt-1 rounded-full ${
              healthFactor <= 1 ? 'bg-red-500' : 'bg-orange-500'
            } animate-pulse shadow-lg`}></div>
            <div className="flex-1">
              <div className="font-bold text-sm mb-1 text-slate-900 dark:text-white">
                {healthFactor <= 1 ? "⚠️ Critical: Liquidation Risk" : "⚡ Warning: Low Health Factor"}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {healthFactor <= 1 
                  ? "Your position is at immediate risk of liquidation. Add collateral or repay debt now!" 
                  : "Your position is approaching liquidation territory. Consider adding collateral."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons with Smart Hierarchy */}
      <div className="grid grid-cols-2 gap-3 pt-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={onAddCollateral}
              size="lg"
              className={`w-full font-bold ${
                isPrimaryAction 
                  ? 'bg-gradient-to-r from-ocean-teal to-highlight-aqua hover:from-ocean-teal/90 hover:to-highlight-aqua/90 text-white shadow-lg shadow-ocean-teal/30 animate-scale-in' 
                  : 'bg-ocean-teal hover:bg-ocean-teal/90 text-white'
              } transition-all duration-300`}
            >
              Add Collateral
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="font-medium mb-1">Strengthen Your Position</p>
            <p className="text-xs">Deposit more assets to increase your collateral, improve your health factor, and gain more borrowing capacity.</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={onBuyVoi}
              size="lg"
              variant="outline"
              className="w-full border-2 border-whale-gold text-whale-gold hover:bg-whale-gold hover:text-black font-bold transition-all duration-300 hover:shadow-lg hover:shadow-whale-gold/20"
            >
              Buy VOI
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="font-medium mb-1">Get VOI Tokens</p>
            <p className="text-xs">Purchase VOI tokens to use as collateral or to repay VOI-denominated debt. Strengthen your position in the ecosystem.</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Additional Quick Actions */}
      {healthFactor > 1.2 && (
        <div className="pt-3 text-center">
          <p className="text-xs text-muted-foreground">
            ✅ Your position is healthy. Keep monitoring market conditions.
          </p>
        </div>
      )}
    </>
  );
};

export default HealthFactorActions;
