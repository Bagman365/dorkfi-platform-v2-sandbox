
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { MarketData } from './types';
import { getTokenImagePath } from '@/utils/tokenImageUtils';
import { Badge } from '@/components/ui/badge';

interface MarketHeaderProps {
  marketData: MarketData;
  chainId?: 'voi' | 'algorand';
  onClose: () => void;
}

export const MarketHeader = ({ marketData, chainId = 'voi', onClose }: MarketHeaderProps) => {
  const isPositive = marketData.priceChange24h >= 0;
  
  return (
    <div className="relative p-6 border-b border-border/30">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors backdrop-blur-sm"
      >
        <X className="w-5 h-5 text-muted-foreground" />
      </button>

      <div className="flex items-start gap-4">
        {/* Token Icon with Chain Badge */}
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ocean-teal/20 to-primary/20 p-0.5">
            <img
              src={getTokenImagePath(marketData.symbol)}
              alt={marketData.symbol}
              className="w-full h-full rounded-2xl object-cover bg-background"
            />
          </div>
          <Badge 
            variant="secondary" 
            className="absolute -bottom-1 -right-1 text-[10px] px-1.5 py-0.5 bg-background border border-border"
          >
            {chainId.toUpperCase()}
          </Badge>
        </div>

        {/* Token Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-foreground truncate">
            {marketData.symbol}
          </h2>
          <p className="text-sm text-muted-foreground">{marketData.name}</p>
        </div>

        {/* Price & Sparkline */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              ${marketData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </p>
            <div className={`flex items-center justify-end gap-1 text-sm ${isPositive ? 'text-green-500' : 'text-destructive'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{isPositive ? '+' : ''}{marketData.priceChange24h.toFixed(2)}%</span>
              <span className="text-muted-foreground text-xs">24h</span>
            </div>
          </div>

          {/* Sparkline */}
          <div className="w-24 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketData.priceHistory}>
                <defs>
                  <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPositive ? '#21EFA3' : '#ef4444'} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={isPositive ? '#21EFA3' : '#ef4444'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? '#21EFA3' : '#ef4444'}
                  strokeWidth={2}
                  fill="url(#sparklineGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
