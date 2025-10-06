
import React from 'react';
import { LiquidationAccount } from '@/hooks/useLiquidationData';
import { shortenAddress } from '@/utils/liquidationUtils';
import { getRiskColor, getRiskLevel, getRiskVariant } from '@/utils/riskCalculations';
import DorkFiButton from '@/components/ui/DorkFiButton';
import HealthFactorGauge from './HealthFactorGauge';
import PositionSummary from './PositionSummary';
import AssetList from './AssetList';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Zap } from 'lucide-react';

interface AccountOverviewProps {
  account: LiquidationAccount;
  onInitiateLiquidation: () => void;
}

export default function AccountOverview({ account, onInitiateLiquidation }: AccountOverviewProps) {
  const riskColor = getRiskColor(account.healthFactor);
  const riskLevel = getRiskLevel(account.healthFactor);
  const isLiquidatable = account.healthFactor <= 1.0;
  const isHighRisk = account.healthFactor <= 1.1;

  return (
    <div className="space-y-5">
      {/* Account Header */}
      <div className="flex flex-col gap-4 p-5 rounded-lg bg-white/80 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Account Address</p>
            <p className="font-mono text-base font-semibold text-slate-800 dark:text-white">
              {shortenAddress(account.walletAddress, 8)}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Health Factor</p>
            <p className={`text-xl font-bold ${riskColor}`}>
              {account.healthFactor.toFixed(3)}
            </p>
          </div>
        </div>
        
        {(isLiquidatable || isHighRisk) && (
          <DorkFiButton
            variant={isLiquidatable ? "danger-outline" : "high"}
            onClick={onInitiateLiquidation}
            className="flex items-center justify-center gap-2 w-full h-12"
          >
            {isLiquidatable ? <Zap className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {isLiquidatable ? "Liquidate Now" : "Monitor Position"}
          </DorkFiButton>
        )}
      </div>

      {/* Health Factor Gauge */}
      <HealthFactorGauge healthFactor={account.healthFactor} />

      {/* Position Summary */}
      <PositionSummary account={account} />

      {/* Asset Lists */}
      <div className="grid gap-5 md:grid-cols-2">
        <AssetList 
          title="Collateral Assets" 
          assets={account.collateralAssets} 
          colorScheme="collateral" 
        />
        <AssetList 
          title="Borrowed Assets" 
          assets={account.borrowedAssets} 
          colorScheme="borrowed" 
        />
      </div>

      {/* Risk Warning for Liquidatable Positions */}
      {isLiquidatable && (
        <Alert 
          variant="destructive" 
          className="border-2 border-destructive"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-base font-semibold">
            Critical Risk Warning
          </AlertTitle>
          <AlertDescription className="text-sm">
            This position can be liquidated immediately. The health factor is below 1.0, making it eligible for liquidation by any user.
            Liquidators can claim up to 50% of the collateral with a 5% bonus.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
