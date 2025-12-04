
import { Shield, Percent, AlertTriangle, Wallet, Radio, BadgeCheck } from 'lucide-react';
import { MarketData } from './types';
import { cn } from '@/lib/utils';

interface CollateralRiskPanelProps {
  marketData: MarketData;
}

export const CollateralRiskPanel = ({ marketData }: CollateralRiskPanelProps) => {
  type StatusType = 'good' | 'warning' | 'neutral';
  
  const riskParams: Array<{
    label: string;
    value: string;
    icon: typeof Percent;
    description: string;
    status: StatusType;
  }> = [
    {
      label: 'Max LTV',
      value: `${marketData.maxLTV}%`,
      icon: Percent,
      description: 'Maximum Loan-to-Value ratio',
      status: 'neutral',
    },
    {
      label: 'Liquidation Threshold',
      value: `${marketData.liquidationThreshold}%`,
      icon: AlertTriangle,
      description: 'LTV at which liquidation occurs',
      status: marketData.liquidationThreshold > 80 ? 'good' : 'warning',
    },
    {
      label: 'Liquidation Bonus',
      value: `${marketData.liquidationBonus}%`,
      icon: Wallet,
      description: 'Penalty paid to liquidators',
      status: 'neutral',
    },
    {
      label: 'Reserve Factor',
      value: `${marketData.reserveFactor}%`,
      icon: Shield,
      description: 'Protocol fee on interest',
      status: 'neutral',
    },
  ];

  const getStatusColor = (status: 'good' | 'warning' | 'neutral') => {
    switch (status) {
      case 'good': return 'text-green-500 bg-green-500/10';
      case 'warning': return 'text-yellow-500 bg-yellow-500/10';
      default: return 'text-muted-foreground bg-muted/50';
    }
  };

  return (
    <div className="px-6 py-4">
      <div className="p-4 rounded-xl glass-card border border-border/30">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Collateral & Risk Parameters</h3>
        </div>

        {/* Risk Parameters Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {riskParams.map((param) => (
            <div 
              key={param.label}
              className="p-3 rounded-lg bg-muted/30 border border-border/20"
            >
              <div className="flex items-center gap-2 mb-1">
                <param.icon className={cn(
                  "w-4 h-4",
                  getStatusColor(param.status).split(' ')[0]
                )} />
                <span className="text-xs text-muted-foreground">{param.label}</span>
              </div>
              <p className="text-lg font-bold text-foreground">{param.value}</p>
            </div>
          ))}
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-border/30">
          {/* Oracle Status */}
          <div className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg",
            marketData.oracleStatus === 'live' 
              ? "bg-green-500/10 border border-green-500/30" 
              : "bg-yellow-500/10 border border-yellow-500/30"
          )}>
            <Radio className={cn(
              "w-4 h-4",
              marketData.oracleStatus === 'live' ? "text-green-500" : "text-yellow-500"
            )} />
            <span className={cn(
              "text-sm font-medium",
              marketData.oracleStatus === 'live' ? "text-green-500" : "text-yellow-500"
            )}>
              Oracle: {marketData.oracleStatus === 'live' ? 'Live' : 'Stale'}
            </span>
          </div>

          {/* Audit Badge */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30">
            <BadgeCheck className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Audited by {marketData.auditProvider}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
