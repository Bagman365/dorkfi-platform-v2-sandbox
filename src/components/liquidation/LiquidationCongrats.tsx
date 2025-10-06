
import React from "react";
import { CheckCircle2, Sparkles, Trophy, Twitter, Link2, Share2, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DorkFiButton from "@/components/ui/DorkFiButton";
import { LiquidationAccount } from '@/hooks/useLiquidationData';
import { LiquidationParams } from './EnhancedAccountDetailModal';
import { shortenAddress } from '@/utils/liquidationUtils';
import { toast } from "@/hooks/use-toast";

interface LiquidationCongratsProps {
  account: LiquidationAccount;
  liquidationParams: LiquidationParams;
  onViewTransaction: () => void;
  onReturnToMarkets: () => void;
  onLiquidateAnother: () => void;
  onClose: () => void;
}

const LiquidationCongrats: React.FC<LiquidationCongratsProps> = ({
  account,
  liquidationParams,
  onViewTransaction,
  onReturnToMarkets,
  onLiquidateAnother,
  onClose,
}) => {
  const navigate = useNavigate();
  
  const generateShareUrl = () => {
    const params = new URLSearchParams({
      bonus: liquidationParams.liquidationBonus.toString(),
      token: liquidationParams.collateralToken,
      amount: liquidationParams.collateralAmount.toFixed(4),
    });
    return `${window.location.origin}/liquidation-markets?${params.toString()}`;
  };

  const shareMessage = `Just executed a successful liquidation on DorkFi! 💰 Earned $${liquidationParams.liquidationBonus.toLocaleString()} bonus 🎯 Received ${liquidationParams.collateralAmount.toFixed(4)} ${liquidationParams.collateralToken}\n\nStart liquidating on DorkFi:`;

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(generateShareUrl())}`;
    window.open(url, '_blank', 'width=550,height=420');
  };


  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generateShareUrl());
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DorkFi Liquidation Success',
          text: shareMessage,
          url: generateShareUrl(),
        });
      } catch (err) {
        // User cancelled share
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
      {/* Confetti & Sparkles */}
      <div className="relative flex flex-col items-center justify-center mb-2">
        <Sparkles className="absolute -top-3 -left-3 text-whale-gold w-7 h-7 animate-bounce" />
        <Sparkles className="absolute -top-3 -right-3 text-highlight-aqua w-7 h-7 animate-bounce animation-delay-300" />
        <Trophy className="absolute -bottom-2 -right-2 text-whale-gold w-6 h-6 animate-pulse" />
        <CheckCircle2 className="w-16 h-16 text-green-500 drop-shadow-xl bg-white dark:bg-slate-800 rounded-full p-1 border-4 border-whale-gold z-10" />
        <div className="mt-[-30px] w-32 h-32 rounded-xl shadow-md border-4 border-whale-gold mx-auto bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 flex items-center justify-center">
          <div className="text-red-600 dark:text-red-300 font-bold text-lg">
            {liquidationParams.collateralToken}
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-center mb-1 text-white">Liquidation Successful!</h2>
      
      <div className="text-center text-base text-slate-200 mb-2 font-medium">
        You successfully liquidated position{" "}
        <span className="text-whale-gold font-mono">{shortenAddress(account.walletAddress)}</span>
      </div>
      
      {/* Liquidation Details */}
      <div className="bg-white/10 rounded-lg p-4 w-full mb-2">
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Debt Repaid:</span>
            <span className="text-white font-semibold">
              ${liquidationParams.repayAmountUSD.toLocaleString()} {liquidationParams.repayToken}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Collateral Received:</span>
            <span className="text-ocean-teal font-semibold">
              {liquidationParams.collateralAmount.toFixed(4)} {liquidationParams.collateralToken}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Liquidation Bonus:</span>
            <span className="text-whale-gold font-semibold">
              ${liquidationParams.liquidationBonus.toLocaleString()} (5%)
            </span>
          </div>
        </div>
      </div>
      
      {/* Share Section */}
      <div className="w-full mt-3 mb-2">
        <h3 className="text-sm font-semibold text-center text-slate-300 mb-3">Share Your Success</h3>
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleTwitterShare}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-lg transition-colors"
            title="Share on Twitter/X"
          >
            <Twitter className="w-4 h-4" />
            <span className="text-sm">Twitter</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            title="Copy Link"
          >
            <Link2 className="w-4 h-4" />
            <span className="text-sm">Copy</span>
          </button>
          
          {navigator.share && (
            <button
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex flex-col gap-2 w-full mt-2">
        <DorkFiButton
          variant="primary"
          className="w-full bg-ocean-teal hover:bg-ocean-teal/90 text-white rounded-xl py-3 text-lg"
          onClick={onViewTransaction}
        >
          Liquidate Another Position
        </DorkFiButton>
        
        <DorkFiButton
          variant="secondary"
          className="w-full border-ocean-teal text-ocean-teal dark:border-whale-gold dark:text-whale-gold"
          onClick={onReturnToMarkets}
        >
          Return to Liquidation Markets
        </DorkFiButton>
        
        <DorkFiButton
          variant="secondary"
          className="w-full border-ocean-teal text-ocean-teal dark:border-whale-gold dark:text-whale-gold flex items-center justify-center gap-2"
          onClick={() => navigate('/')}
        >
          <Wallet className="w-4 h-4" />
          View Portfolio
        </DorkFiButton>
      </div>
      
      <button
        type="button"
        className="text-xs underline text-slate-300 hover:text-white mt-2 transition-colors"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default LiquidationCongrats;
