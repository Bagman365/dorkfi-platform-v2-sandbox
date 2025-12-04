
import { ArrowUpCircle, ArrowDownCircle, Wallet, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserPosition, MarketData } from './types';
import { cn } from '@/lib/utils';

interface PrimaryActionButtonsProps {
  marketData: MarketData;
  userPosition?: UserPosition;
  onDeposit?: () => void;
  onWithdraw?: () => void;
  onBorrow?: () => void;
  onRepay?: () => void;
}

export const PrimaryActionButtons = ({
  marketData,
  userPosition,
  onDeposit,
  onWithdraw,
  onBorrow,
  onRepay,
}: PrimaryActionButtonsProps) => {
  const hasDeposit = userPosition && userPosition.supplied > 0;
  const hasBorrow = userPosition && userPosition.borrowed > 0;

  return (
    <div className="px-4 sm:px-6 py-4">
      <div className="p-3 sm:p-4 rounded-xl glass-card border border-primary/30 space-y-3">
        {!hasDeposit ? (
          // No deposits - show primary deposit CTA
          <Button
            onClick={onDeposit}
            className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-primary to-ocean-teal hover:from-primary/90 hover:to-ocean-teal/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 active:scale-[0.98]"
          >
            <ArrowUpCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="truncate">Deposit {marketData.symbol} ({marketData.supplyAPY.toFixed(2)}% APY)</span>
          </Button>
        ) : (
          // Has deposits - show borrow primary + withdraw secondary
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <Button
              onClick={onBorrow}
              className="h-12 font-semibold bg-gradient-to-r from-whale-gold to-orange-500 hover:from-whale-gold/90 hover:to-orange-500/90 text-primary-foreground rounded-xl shadow-lg shadow-whale-gold/25 transition-all hover:shadow-whale-gold/40 active:scale-[0.98]"
            >
              <Banknote className="w-4 h-4 mr-2" />
              Borrow WAD
            </Button>
            <Button
              onClick={onWithdraw}
              variant="outline"
              className="h-12 font-semibold border-primary/30 hover:bg-primary/10 rounded-xl active:scale-[0.98]"
            >
              <ArrowDownCircle className="w-4 h-4 mr-2" />
              Withdraw ${userPosition?.withdrawable?.toLocaleString() ?? 0}
            </Button>
          </div>
        )}

        {hasBorrow && (
          <Button
            onClick={onRepay}
            variant="outline"
            className="w-full h-12 font-semibold border-orange-500/30 hover:bg-orange-500/10 text-orange-500 rounded-xl active:scale-[0.98]"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Repay ${userPosition?.borrowed?.toLocaleString() ?? 0} Borrowed
          </Button>
        )}

        {/* Quick info below buttons */}
        <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border/30">
          <span>Supply APY: <span className="text-green-500 font-medium">{marketData.supplyAPY.toFixed(2)}%</span></span>
          <span>Borrow APY: <span className="text-orange-500 font-medium">{marketData.borrowAPY.toFixed(2)}%</span></span>
        </div>
      </div>
    </div>
  );
};
