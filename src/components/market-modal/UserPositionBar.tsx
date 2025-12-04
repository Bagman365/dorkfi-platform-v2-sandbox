
import { useState } from 'react';
import { ChevronDown, ChevronUp, Wallet, TrendingUp, TrendingDown, Shield } from 'lucide-react';
import { UserPosition, MarketData } from './types';
import { cn } from '@/lib/utils';

interface UserPositionBarProps {
  userPosition?: UserPosition;
  marketData: MarketData;
  isWalletConnected?: boolean;
  onConnectWallet?: () => void;
}

export const UserPositionBar = ({ 
  userPosition, 
  marketData,
  isWalletConnected = true,
  onConnectWallet 
}: UserPositionBarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isWalletConnected) {
    return (
      <div className="mx-6 my-4 p-4 rounded-xl glass-card border border-primary/20">
        <button 
          onClick={onConnectWallet}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors w-full justify-center"
        >
          <Wallet className="w-5 h-5" />
          <span className="font-medium">Connect Wallet to View Your Position</span>
        </button>
      </div>
    );
  }

  const stats = [
    { 
      label: 'Supplied', 
      value: userPosition?.supplied ?? 0, 
      prefix: '$',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    { 
      label: 'Borrowed', 
      value: userPosition?.borrowed ?? 0, 
      prefix: '$',
      icon: TrendingDown,
      color: 'text-orange-500'
    },
    { 
      label: 'Withdrawable', 
      value: userPosition?.withdrawable ?? 0, 
      prefix: '$',
      color: 'text-muted-foreground'
    },
    { 
      label: 'Borrowable', 
      value: userPosition?.borrowable ?? 0, 
      prefix: '$',
      color: 'text-muted-foreground'
    },
    { 
      label: 'Health Factor', 
      value: userPosition?.healthFactor ?? 0, 
      prefix: '',
      icon: Shield,
      color: userPosition && userPosition.healthFactor > 1.5 
        ? 'text-green-500' 
        : userPosition && userPosition.healthFactor > 1.0 
          ? 'text-yellow-500' 
          : 'text-destructive'
    },
  ];

  return (
    <div className="mx-6 my-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 rounded-xl glass-card border border-primary/20 hover:border-primary/40 transition-all"
      >
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          Your Position
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <div className={cn(
        "grid grid-cols-5 gap-3 overflow-hidden transition-all duration-300",
        isExpanded ? "mt-3 max-h-32 opacity-100" : "max-h-0 opacity-0 mt-0"
      )}>
        {stats.map((stat) => (
          <div 
            key={stat.label}
            className="p-3 rounded-xl glass-card border border-border/30 text-center"
          >
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className={cn("text-lg font-bold", stat.color)}>
              {stat.prefix}{stat.value.toLocaleString(undefined, { 
                minimumFractionDigits: stat.label === 'Health Factor' ? 2 : 0,
                maximumFractionDigits: 2 
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
