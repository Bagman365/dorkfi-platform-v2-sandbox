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
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Liquidation Price:</span>
      <span className="text-sm font-semibold text-muted-foreground">
        ${formattedPrice}
      </span>
    </div>
  );
};

export default LiquidationPrice;
