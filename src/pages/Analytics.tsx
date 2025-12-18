import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CanvasBubbles from "@/components/CanvasBubbles";
import AnalyticsHero from "@/components/analytics/AnalyticsHero";
import KPIGrid from "@/components/analytics/KPIGrid";
import AnalyticsSection from "@/components/analytics/AnalyticsSection";
import TVLChart from "@/components/analytics/TVLChart";
import UtilizationChart from "@/components/analytics/UtilizationChart";
import RevenueChart from "@/components/analytics/RevenueChart";

import WADCirculationChart from "@/components/analytics/WADCirculationChart";
import MAUChart from "@/components/analytics/MAUChart";
import LoanVolumeChart from "@/components/analytics/LoanVolumeChart";
import AssetDistributionChart from "@/components/analytics/AssetDistributionChart";
import InterestRateChart from "@/components/analytics/InterestRateChart";
import HealthFactorChart from "@/components/analytics/HealthFactorChart";

import DepositsChart from "@/components/analytics/DepositsChart";
import WithdrawalsChart from "@/components/analytics/WithdrawalsChart";
import AvgLiquidationSizeCard from "@/components/analytics/AvgLiquidationSizeCard";
interface AnalyticsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}
const Analytics = ({
  activeTab,
  onTabChange
}: AnalyticsProps) => {
  return <div className="min-h-screen bg-background relative">
      {/* Light Mode Beach Background */}
      <div className="absolute inset-0 light-mode-beach-bg dark:hidden" />
      <div className="absolute inset-0 beach-overlay dark:hidden" />
      
      {/* Dark Mode Ocean Background */}
      <div className="absolute inset-0 z-0 hidden dark:block dorkfi-dark-bg-with-overlay" />

      {/* Advanced Canvas Bubble System - Dark Mode Only */}
      <div className="hidden dark:block">
        <CanvasBubbles />
      </div>

      <Header activeTab={activeTab} onTabChange={onTabChange} />
      
      <main className="max-w-[1200px] mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-8 relative z-10">
        <div className="space-y-6 md:space-y-8 animate-fade-in">
          {/* Hero Section */}
          <AnalyticsHero />
          
          {/* Top KPI Cards */}
          <KPIGrid />
          
          {/* Section 1: Protocol Health & Growth */}
          <AnalyticsSection title="Protocol Health & Growth">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TVLChart />
              <UtilizationChart />
            </div>
            <RevenueChart />
            <WADCirculationChart />
          </AnalyticsSection>
          
          {/* Section 2: User & Market Activity */}
          <AnalyticsSection title="User & Market Activity">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DepositsChart />
              <WithdrawalsChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <MAUChart />
                <AvgLiquidationSizeCard />
              </div>
              <LoanVolumeChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AssetDistributionChart />
              <InterestRateChart />
            </div>
            <HealthFactorChart />
          </AnalyticsSection>
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default Analytics;