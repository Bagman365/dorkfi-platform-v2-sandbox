import React from "react";

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
    <div className="rounded-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-2 border-red-200 dark:border-red-800/30 p-4 backdrop-blur-sm">
      <div className="font-medium text-muted-foreground mb-1 text-sm">Liquidation Price</div>
      <div className="text-2xl font-bold text-destructive">
        ${formattedPrice} / {collateralSymbol}
      </div>
    </div>
  );
};

export default LiquidationPrice;
