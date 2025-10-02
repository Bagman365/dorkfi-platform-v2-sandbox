import { Card, CardContent } from "@/components/ui/card";
import React from 'react';
import UnderwaterScene from './liquidation/UnderwaterScene';
import PositionStatsGrid from './liquidation/PositionStatsGrid';
import HealthFactorActions from './liquidation/HealthFactorActions';

interface EnhancedHealthFactorProps {
  healthFactor: number;
  totalCollateral: number;
  totalBorrowed: number;
  liquidationMargin: number;
  netLTV: number;
  dorkNftImage: string;
  underwaterBg: string;
  onAddCollateral: () => void;
  onBuyVoi: () => void;
}

const EnhancedHealthFactor = ({
  healthFactor,
  totalCollateral,
  totalBorrowed,
  liquidationMargin,
  netLTV,
  dorkNftImage,
  underwaterBg,
  onAddCollateral,
  onBuyVoi
}: EnhancedHealthFactorProps) => {
  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in">
      <Card className="bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-2 border-gray-200/50 dark:border-ocean-teal/30 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-ocean-teal/50">
        <CardContent className="p-8">
          {/* Enhanced Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-10">
            {/* Left Side - Stats Panel & CTAs */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-ocean-teal/20">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-gradient-to-b from-ocean-teal to-highlight-aqua rounded-full"></span>
                  Position Overview
                </h2>
              </div>
              
              {/* Stats Grid with Tooltips */}
              <PositionStatsGrid 
                totalCollateral={totalCollateral}
                totalBorrowed={totalBorrowed}
                liquidationMargin={liquidationMargin}
                netLTV={netLTV}
                healthFactor={healthFactor}
              />
              
              {/* Action Buttons and Risk Warning */}
              <HealthFactorActions 
                healthFactor={healthFactor}
                onAddCollateral={onAddCollateral}
                onBuyVoi={onBuyVoi}
              />
            </div>

            {/* Right Side - Enhanced Health Gauge */}
            <div className="lg:border-l-2 lg:border-ocean-teal/20 lg:pl-10">
              <UnderwaterScene 
                healthFactor={healthFactor}
                dorkNftImage={dorkNftImage}
                underwaterBg={underwaterBg}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedHealthFactor;
