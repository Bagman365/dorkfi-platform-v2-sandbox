import React from 'react';
import { formatPercentageChange } from '@/utils/analyticsUtils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  subtitle?: string;
  icon?: string;
  iconImage?: string;
}

const KPICard = ({ title, value, change, subtitle, icon, iconImage }: KPICardProps) => {
  const changeData = change ? formatPercentageChange(change) : null;

  return (
    <div className="dorkfi-card-bg rounded-xl border border-border/40 p-3 sm:p-4 card-hover transition-all h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {iconImage ? (
              <img src={iconImage} alt={title} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0" />
            ) : icon ? (
              <span className="text-base sm:text-lg flex-shrink-0">{icon}</span>
            ) : null}
            <h3 className="dorkfi-caption text-muted-foreground text-xs sm:text-sm leading-tight">
              {title}
              {subtitle && <span className="ml-1">({subtitle})</span>}
            </h3>
          </div>
          {changeData && (
            <div className={`flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-medium flex-shrink-0 ${
              changeData.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeData.isPositive ? (
                <TrendingUp size={10} className="sm:w-3 sm:h-3" />
              ) : (
                <TrendingDown size={10} className="sm:w-3 sm:h-3" />
              )}
              <span className="hidden sm:inline">{changeData.formatted}</span>
              <span className="sm:hidden">{changeData.formatted.replace('%', '')}</span>
            </div>
          )}
        </div>
        
        <div className="mt-auto">
          <p className="text-lg sm:text-xl md:text-2xl font-bold dorkfi-text-primary leading-tight">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KPICard;