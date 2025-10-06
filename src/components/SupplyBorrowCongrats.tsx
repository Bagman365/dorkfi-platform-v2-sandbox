
import React from "react";
import { CheckCircle2, Sparkles, Link2, Wallet, Share } from "lucide-react";
import DorkFiButton from "@/components/ui/DorkFiButton";
import { toast } from "@/hooks/use-toast";

interface SupplyBorrowCongratsProps {
  transactionType: "deposit" | "borrow" | "withdraw" | "repay";
  asset: string;
  assetIcon: string;
  amount: string;
  onViewTransaction: () => void;
  onGoToPortfolio: () => void;
  onMakeAnother: () => void;
  onClose: () => void;
}

const SupplyBorrowCongrats: React.FC<SupplyBorrowCongratsProps> = ({
  transactionType,
  asset,
  assetIcon,
  amount,
  onViewTransaction,
  onGoToPortfolio,
  onMakeAnother,
  onClose,
}) => {
  const getTransactionMessage = () => {
    switch (transactionType) {
      case "deposit":
        return { action: "deposited", preposition: "to" };
      case "borrow":
        return { action: "borrowed", preposition: "from" };
      case "withdraw":
        return { action: "withdrew", preposition: "from" };
      case "repay":
        return { action: "repaid", preposition: "to" };
      default:
        return { action: "processed", preposition: "with" };
    }
  };

  const { action, preposition } = getTransactionMessage();
  
  const generateShareUrl = () => {
    const params = new URLSearchParams({
      action: transactionType,
      asset: asset,
      amount: amount,
    });
    return `${window.location.origin}/?${params.toString()}`;
  };

  const shareMessage = `Just ${action} ${amount} ${asset} on DorkFi! 🎯\n\nJoin me on DorkFi:`;

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(generateShareUrl())}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleFarcasterShare = () => {
    const text = `${shareMessage} ${generateShareUrl()}`;
    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=550,height=600');
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
  
  return (
    <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
      {/* Confetti & Sparkles */}
      <div className="relative flex flex-col items-center justify-center mb-2">
        <Sparkles className="absolute -top-3 -left-3 text-whale-gold w-7 h-7 animate-bounce" />
        <Sparkles className="absolute -top-3 -right-3 text-highlight-aqua w-7 h-7 animate-bounce animation-delay-300" />
        <CheckCircle2 className="w-16 h-16 text-green-500 drop-shadow-xl bg-white dark:bg-slate-800 rounded-full p-1 border-4 border-whale-gold z-10" />
        <img
          src={assetIcon}
          alt={`${asset} icon`}
          className="mt-[-30px] w-32 h-32 rounded-xl shadow-md border-4 border-whale-gold mx-auto bg-bubble-white dark:bg-slate-800 object-cover"
        />
      </div>
      
      <h2 className="text-xl font-bold text-center mb-1">Transaction Successful!</h2>
      
      <div className="text-center text-base text-slate-700 dark:text-slate-200 mb-2 font-medium">
        You successfully {action}{" "}
        <span className="text-whale-gold">{amount} {asset}</span>
        {" "}{preposition} the protocol.
      </div>
      
      <div className="flex flex-col gap-2 w-full mt-2">
        <DorkFiButton
          variant="primary"
          className="w-full bg-ocean-teal hover:bg-ocean-teal/90 text-white rounded-xl py-3 text-lg"
          onClick={onMakeAnother}
        >
          Make Another Transaction
        </DorkFiButton>
        
        <DorkFiButton
          variant="secondary"
          className="w-full border-ocean-teal text-ocean-teal dark:border-whale-gold dark:text-whale-gold"
          onClick={onGoToPortfolio}
        >
          View Profile
        </DorkFiButton>
      </div>
      
      {/* Share Section */}
      <div className="w-full mt-3 mb-2">
        <h3 className="text-sm font-semibold text-center text-slate-600 dark:text-slate-300 mb-3">Share Your Success</h3>
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleTwitterShare}
            className="flex items-center justify-center w-12 h-12 bg-[#000000] hover:bg-[#1a1a1a] text-white rounded-full transition-all shadow-lg hover:shadow-xl"
            title="Share on X"
          >
            <img src="/lovable-uploads/x_round_icon.png" alt="X" className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleFarcasterShare}
            className="flex items-center justify-center w-12 h-12 bg-[#855DCD] hover:bg-[#7347bc] text-white rounded-full transition-all shadow-lg hover:shadow-xl"
            title="Share on Farcaster"
          >
            <img src="/lovable-uploads/farcaster_icon.png" alt="Farcaster" className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center w-12 h-12 bg-slate-700 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500 text-white rounded-full transition-all shadow-lg hover:shadow-xl"
            title="Copy Link"
          >
            <Link2 className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      <button
        type="button"
        className="text-xs underline text-slate-500 dark:text-slate-300 hover:text-slate-800 hover:dark:text-white mt-2 transition-colors"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default SupplyBorrowCongrats;
