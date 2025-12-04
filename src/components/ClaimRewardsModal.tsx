import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Clock, TrendingUp, Coins } from "lucide-react";
import SupplyBorrowCongrats from "./SupplyBorrowCongrats";

interface ClaimRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableRewards?: number;
  rewardTokenSymbol?: string;
  rewardTokenIcon?: string;
  rewardStats?: {
    totalEarned: number;
    claimableNow: number;
    nextRewardIn: string;
    rewardAPY: number;
  };
}

const ClaimRewardsModal = ({ 
  isOpen, 
  onClose, 
  availableRewards = 125.50,
  rewardTokenSymbol = "DORK",
  rewardTokenIcon = "/lovable-uploads/dork_fi_logo_edit1_light.png",
  rewardStats = {
    totalEarned: 1250.00,
    claimableNow: 125.50,
    nextRewardIn: "2h 30m",
    rewardAPY: 12.5,
  }
}: ClaimRewardsModalProps) => {
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setShowSuccess(false);
    }
  }, [isOpen]);

  const handleClaim = () => {
    console.log(`Claiming ${availableRewards} ${rewardTokenSymbol}`);
    
    setTimeout(() => {
      setShowSuccess(true);
    }, 500);
  };

  const handleViewTransaction = () => {
    window.open("https://testnet.algoexplorer.io/", "_blank");
  };

  const handleGoToPortfolio = () => {
    onClose();
    window.location.href = "/";
  };

  const handleMakeAnother = () => {
    setShowSuccess(false);
  };

  const hasRewards = availableRewards > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card dark:bg-slate-900 rounded-xl border border-gray-200/50 dark:border-ocean-teal/20 shadow-xl card-hover hover:shadow-lg hover:border-ocean-teal/40 transition-all max-w-md px-0 py-0">
        {showSuccess ? (
          <div className="p-6">
            <SupplyBorrowCongrats
              transactionType="claim"
              asset={rewardTokenSymbol}
              assetIcon={rewardTokenIcon}
              amount={availableRewards.toString()}
              onViewTransaction={handleViewTransaction}
              onGoToPortfolio={handleGoToPortfolio}
              onMakeAnother={handleMakeAnother}
              onClose={onClose}
            />
          </div>
        ) : (
          <>
            <DialogHeader className="pt-6 px-8 pb-1">
              <DialogTitle className="text-2xl font-bold text-center text-slate-800 dark:text-white">
                Claim Rewards
              </DialogTitle>
              <DialogDescription className="text-center mt-1 text-sm text-slate-400 dark:text-slate-400">
                Claim your accumulated rewards from protocol participation.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 pt-2 px-8 pb-8">
              {/* Available Rewards Display */}
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-whale-gold/10 to-whale-gold/5 border border-whale-gold/20">
                <Gift className="w-8 h-8 text-whale-gold mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Available to Claim</p>
                <p className="text-3xl font-bold text-whale-gold">
                  {availableRewards.toLocaleString()} {rewardTokenSymbol}
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  ≈ ${(availableRewards * 0.05).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {/* Reward Stats Card */}
              <Card className="bg-white/80 dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-500 dark:text-slate-400">Total Earned</span>
                    </div>
                    <span className="text-sm font-medium text-slate-800 dark:text-white">
                      {rewardStats.totalEarned.toLocaleString()} {rewardTokenSymbol}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-500 dark:text-slate-400">Reward APY</span>
                    </div>
                    <span className="text-sm font-medium text-teal-600 dark:text-teal-400">
                      {rewardStats.rewardAPY}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-500 dark:text-slate-400">Next Reward In</span>
                    </div>
                    <span className="text-sm font-medium text-slate-800 dark:text-white">
                      {rewardStats.nextRewardIn}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleClaim}
                disabled={!hasRewards}
                className="w-full font-semibold text-white h-12 bg-whale-gold hover:bg-whale-gold/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {hasRewards ? `Claim ${availableRewards.toLocaleString()} ${rewardTokenSymbol}` : "No Rewards Available"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClaimRewardsModal;