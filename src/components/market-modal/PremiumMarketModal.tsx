import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PremiumMarketModalProps } from './types';
import { MarketHeader } from './MarketHeader';
import { UserPositionBar } from './UserPositionBar';
import { MarketOverview } from './MarketOverview';
import { PrimaryActionButtons } from './PrimaryActionButtons';
import { HealthFactorSimulator } from './HealthFactorSimulator';
import { EarningsCalculator } from './EarningsCalculator';
import { CollateralRiskPanel } from './CollateralRiskPanel';
import { AdvancedDetails } from './AdvancedDetails';
import { MarketModalFooter } from './MarketModalFooter';

export const PremiumMarketModal = ({
  isOpen,
  onClose,
  asset,
  chainId = 'voi',
  marketData,
  userPosition,
  onDeposit,
  onWithdraw,
  onBorrow,
  onRepay,
}: PremiumMarketModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 glass-card border-primary/20 overflow-hidden max-h-[90vh]">
        <DialogTitle className="sr-only">{marketData.symbol} Market Details</DialogTitle>
        <ScrollArea className="max-h-[90vh]">
          <div className="flex flex-col">
            <MarketHeader 
              marketData={marketData} 
              chainId={chainId} 
              onClose={onClose} 
            />
            
            <UserPositionBar 
              userPosition={userPosition}
              marketData={marketData}
              isWalletConnected={true}
            />
            
            <MarketOverview marketData={marketData} />
            
            <PrimaryActionButtons
              marketData={marketData}
              userPosition={userPosition}
              onDeposit={onDeposit}
              onWithdraw={onWithdraw}
              onBorrow={onBorrow}
              onRepay={onRepay}
            />
            
            <HealthFactorSimulator 
              marketData={marketData}
              userPosition={userPosition}
            />
            
            <EarningsCalculator marketData={marketData} />
            
            <CollateralRiskPanel marketData={marketData} />
            
            <AdvancedDetails marketData={marketData} />
            
            <MarketModalFooter />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export { type PremiumMarketModalProps, type MarketData, type UserPosition } from './types';
