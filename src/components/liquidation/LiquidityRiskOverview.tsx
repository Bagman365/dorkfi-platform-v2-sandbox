import React from 'react';
import { Separator } from '@/components/ui/separator';
import { H2 } from '@/components/ui/Typography';

export default function LiquidityRiskOverview() {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="space-y-2">
        <H2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Protocol Liquidity & Risk Overview
        </H2>
        <Separator className="bg-gradient-to-r from-ocean-teal/30 to-transparent" />
      </div>
    </div>
  );
}