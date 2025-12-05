import { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { MarketData } from './types';
import { getTokenImagePath } from '@/utils/tokenImageUtils';
import { Badge } from '@/components/ui/badge';

interface MarketHeaderProps {
  marketData: MarketData;
  chainId?: 'voi' | 'algorand';
  onClose: () => void;
}

export const MarketHeader = ({ marketData, chainId = 'voi' }: MarketHeaderProps) => {
  const isPositive = marketData.priceChange24h >= 0;
  
  // Memoize price history to prevent chart flickering
  const priceHistory = useMemo(() => marketData.priceHistory, [marketData.symbol]);
  
  return (
    <div className="relative p-4 sm:p-6 border-b border-border/30">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Top Row: Token Icon + Info */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          {/* Token Icon with Chain Badge */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-ocean-teal/20 to-primary/20 p-0.5">
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
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground truncate">
              {marketData.symbol}
            </h2>
            <p className="text-sm text-muted-foreground">{marketData.name}</p>
          </div>
        </div>

        {/* Price & Sparkline */}
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="text-left sm:text-right">
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              ${marketData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </p>
            <div className={`flex items-center sm:justify-end gap-1 text-sm ${isPositive ? 'text-green-500' : 'text-destructive'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{isPositive ? '+' : ''}{marketData.priceChange24h.toFixed(2)}%</span>
              <span className="text-muted-foreground text-xs">24h</span>
            </div>
          </div>

          {/* Sparkline - animation disabled to prevent flickering */}
          <div className="w-20 h-10 sm:w-24 sm:h-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceHistory}>
                <defs>
                  <linearGradient id={`sparklineGradient-${marketData.symbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPositive ? '#21EFA3' : '#ef4444'} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={isPositive ? '#21EFA3' : '#ef4444'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? '#21EFA3' : '#ef4444'}
                  strokeWidth={2}
                  fill={`url(#sparklineGradient-${marketData.symbol})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
