import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface LiquidationPriceProps {
  borrowedAmount: number; // in USD
  collateralAmount: number; // in token units
  liquidationThresholdBps: number; // e.g., 8500 for 85%
  collateralSymbol?: string;
}

const SCALE = 1e18;

export const LiquidationPrice: React.FC<LiquidationPriceProps> = ({
  borrowedAmount,
  collateralAmount,
  liquidationThresholdBps,
  collateralSymbol = "COLL",
}) => {
  if (!collateralAmount || !liquidationThresholdBps) return null;

  const liquidationPrice =
    (borrowedAmount * SCALE) /
    (collateralAmount * (liquidationThresholdBps / 10000));

  const formattedPrice = (liquidationPrice / SCALE).toFixed(2);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center justify-center gap-2 cursor-help">
          <span className="text-sm text-muted-foreground">Liquidation Price:</span>
          <span className="text-sm font-semibold text-muted-foreground">
            ${formattedPrice}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="font-medium mb-1">Liquidation Price</p>
        <p className="text-xs">
          If the price of your collateral falls to ${formattedPrice}, your position may be liquidated. 
          Monitor market prices and consider adding more collateral to maintain a healthy position.
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default LiquidationPrice;
