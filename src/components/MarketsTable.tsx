import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Gift } from "lucide-react";

import { useMarketData, SortField, SortOrder } from "@/hooks/useMarketData";
import MarketSearchFilters from "@/components/markets/MarketSearchFilters";
import MarketPagination from "@/components/markets/MarketPagination";
import SupplyBorrowModal from "@/components/SupplyBorrowModal";
import WithdrawModal from "@/components/WithdrawModal";
import ClaimRewardsModal from "@/components/ClaimRewardsModal";
import { PremiumMarketModal, MarketData } from "@/components/market-modal";
import MarketsHeroSection from "@/components/markets/MarketsHeroSection";
import MarketsTableContent from "@/components/markets/MarketsTableContent";
import RiskDisclaimerModal from "@/components/RiskDisclaimerModal";

const RISK_ACK_KEY = 'dorkfi.riskAcknowledged';

const MarketsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("totalSupplyUSD");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [depositModal, setDepositModal] = useState({ isOpen: false, asset: null });
  const [withdrawModal, setWithdrawModal] = useState({ isOpen: false, asset: null });
  const [borrowModal, setBorrowModal] = useState({ isOpen: false, asset: null });
  const [detailModal, setDetailModal] = useState({ isOpen: false, asset: null, marketData: null });
  const [claimRewardsModal, setClaimRewardsModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  
  // Mock user deposits - in real app, this would come from user's wallet/backend
  const [userDeposits] = useState<Record<string, number>>({});

  // Check if user has acknowledged risks
  useEffect(() => {
    const hasAcknowledged = localStorage.getItem(RISK_ACK_KEY);
    if (!hasAcknowledged) {
      setShowRiskModal(true);
    }
  }, []);

  const handleRiskAcknowledge = (doNotShowAgain: boolean) => {
    if (doNotShowAgain) {
      localStorage.setItem(RISK_ACK_KEY, 'true');
    }
    setShowRiskModal(false);
  };

  const {
    data: markets,
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
    handleSearchChange,
    handleSortChange
  } = useMarketData({
    searchTerm,
    sortField,
    sortOrder,
    pageSize: 10
  });

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    handleSearchChange(value);
  };

  const handleSortFieldChange = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
    handleSortChange(field, order);
  };

  const handleDepositClick = (asset: string) => {
    setDepositModal({ isOpen: true, asset });
  };

  const handleWithdrawClick = (asset: string) => {
    setWithdrawModal({ isOpen: true, asset });
  };

  const handleBorrowClick = (asset: string) => {
    setBorrowModal({ isOpen: true, asset });
  };

  const handleCloseDepositModal = () => {
    setDepositModal({ isOpen: false, asset: null });
  };

  const handleCloseWithdrawModal = () => {
    setWithdrawModal({ isOpen: false, asset: null });
  };

  const handleCloseBorrowModal = () => {
    setBorrowModal({ isOpen: false, asset: null });
  };

  const handleRowClick = (market: any) => {
    setDetailModal({ isOpen: true, asset: market.asset, marketData: market });
  };

  const handleInfoClick = (e: React.MouseEvent, market: any) => {
    e.stopPropagation();
    setDetailModal({ isOpen: true, asset: market.asset, marketData: market });
  };

  const handleCloseDetailModal = () => {
    setDetailModal({ isOpen: false, asset: null, marketData: null });
  };

  const getAssetData = (asset: string) => {
    const market = markets.find(m => m.asset === asset);
    if (!market) return null;
    
    return {
      icon: market.icon,
      totalSupply: market.totalSupply,
      totalSupplyUSD: market.totalSupplyUSD,
      supplyAPY: market.supplyAPY,
      totalBorrow: market.totalBorrow,
      totalBorrowUSD: market.totalBorrowUSD,
      borrowAPY: market.borrowAPY,
      utilization: market.utilization,
      collateralFactor: market.collateralFactor,
      liquidity: market.totalSupply - market.totalBorrow,
      liquidityUSD: market.totalSupplyUSD - market.totalBorrowUSD,
    };
  };

  // Transform old market data format to new PremiumMarketModal format
  const transformToMarketData = (market: any): MarketData => {
    const tokenNames: Record<string, string> = {
      VOI: 'Voi Network Token',
      USDC: 'USD Coin',
      UNIT: 'Unit Protocol Token',
      BTC: 'Bitcoin',
      ETH: 'Ethereum',
      WAD: 'Wrapped Algo Dollar',
    };
    
    // Generate mock 7-day price history
    const basePrice = market.asset === 'USDC' ? 1 : market.asset === 'BTC' ? 97000 : market.asset === 'ETH' ? 3800 : 0.15;
    const priceHistory = Array.from({ length: 7 }, (_, i) => ({
      time: `Day ${i + 1}`,
      price: basePrice * (0.95 + Math.random() * 0.1),
    }));
    
    return {
      icon: market.icon,
      name: tokenNames[market.asset] || market.asset,
      symbol: market.asset,
      price: basePrice,
      priceChange24h: (Math.random() - 0.5) * 10,
      priceHistory,
      totalSupply: market.totalSupplyUSD,
      totalBorrow: market.totalBorrowUSD,
      availableLiquidity: market.totalSupplyUSD - market.totalBorrowUSD,
      utilization: market.utilization,
      supplyAPY: market.supplyAPY,
      borrowAPY: market.borrowAPY,
      maxLTV: 75,
      liquidationThreshold: 82,
      liquidationBonus: 5,
      reserveFactor: 10,
      supplyCap: market.totalSupplyUSD * 2,
      borrowCap: market.totalBorrowUSD * 1.5,
      oracleStatus: 'live',
      auditProvider: 'Entersoft Security',
    };
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <div className="space-y-4">
        {/* Hero Section */}
        <MarketsHeroSection />

        {/* Search and Filters */}
        <MarketSearchFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchTermChange}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={handleSortFieldChange}
        />

        {/* Markets Table */}
        <Card className="card-hover bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 shadow-md border border-gray-200/50 dark:border-ocean-teal/20">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">Market Overview</CardTitle>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://docs.dork.fi', '_blank', 'noopener,noreferrer')}
                  className="flex items-center gap-2 bg-ocean-teal/5 border-ocean-teal/20 hover:bg-ocean-teal/10 text-ocean-teal"
                  aria-label="Learn more about markets (opens in new tab)"
                >
                  Learn More
                  <ExternalLink className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setClaimRewardsModal(true)}
                  className="flex items-center gap-2 bg-whale-gold/10 border-whale-gold/30 hover:bg-whale-gold/20 text-whale-gold"
                >
                  <Gift className="h-3 w-3" />
                  Claim Rewards
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Informational guidance - matches Liquidations Queue styles */}
            <section aria-label="What you can do here" className="mb-4 hidden md:block">
              <p className="text-sm text-muted-foreground mt-1">What You Can Do Here:</p>
              <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <p>• Deposit Assets: Earn interest with interest bearing tokens that grow in value over time.</p>
                <p>• Borrow Against Collateral: Access liquidity without selling your holdings.</p>
                <p>• Track Utilization: See how much of each market is borrowed vs. supplied — a key signal for demand and interest rates.</p>
                <p>• Compare Risk Profiles: Different assets have different Loan-to-Value (LTV) limits and liquidation thresholds.</p>
              </div>
            </section>

            <MarketsTableContent
              markets={markets}
              userDeposits={userDeposits}
              onRowClick={handleRowClick}
              onInfoClick={handleInfoClick}
              onDepositClick={handleDepositClick}
              onWithdrawClick={handleWithdrawClick}
              onBorrowClick={handleBorrowClick}
            />
          </CardContent>
        </Card>

        {/* Pagination */}
        <MarketPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
        />

        {/* Premium Market Detail Modal */}
        {detailModal.isOpen && detailModal.asset && detailModal.marketData && (
          <PremiumMarketModal
            isOpen={detailModal.isOpen}
            onClose={handleCloseDetailModal}
            asset={detailModal.asset}
            marketData={transformToMarketData(detailModal.marketData)}
            userPosition={{
              supplied: 500,
              borrowed: 0,
              withdrawable: 500,
              borrowable: 2500,
              healthFactor: 2.45,
              earnings: 12.50,
            }}
            onDeposit={() => handleDepositClick(detailModal.asset!)}
            onWithdraw={() => handleWithdrawClick(detailModal.asset!)}
            onBorrow={() => handleBorrowClick(detailModal.asset!)}
          />
        )}

        {/* Deposit Modal */}
        {depositModal.isOpen && depositModal.asset && getAssetData(depositModal.asset) && (
          <SupplyBorrowModal
            isOpen={depositModal.isOpen}
            onClose={handleCloseDepositModal}
            asset={depositModal.asset}
            mode="deposit"
            assetData={getAssetData(depositModal.asset)}
          />
        )}

        {/* Withdraw Modal */}
        {withdrawModal.isOpen && withdrawModal.asset && getAssetData(withdrawModal.asset) && (
          <WithdrawModal
            isOpen={withdrawModal.isOpen}
            onClose={handleCloseWithdrawModal}
            tokenSymbol={withdrawModal.asset}
            tokenIcon={getAssetData(withdrawModal.asset).icon}
            currentlyDeposited={1000}
            marketStats={{
              supplyAPY: getAssetData(withdrawModal.asset).supplyAPY,
              utilization: getAssetData(withdrawModal.asset).utilization,
              collateralFactor: getAssetData(withdrawModal.asset).collateralFactor,
              tokenPrice: 1.0,
            }}
          />
        )}

        {/* Borrow Modal */}
        {borrowModal.isOpen && borrowModal.asset && getAssetData(borrowModal.asset) && (
          <SupplyBorrowModal
            isOpen={borrowModal.isOpen}
            onClose={handleCloseBorrowModal}
            asset={borrowModal.asset}
            mode="borrow"
            assetData={getAssetData(borrowModal.asset)}
          />
        )}

        {/* Risk Disclaimer Modal */}
        <RiskDisclaimerModal
          isOpen={showRiskModal}
          onAcknowledge={handleRiskAcknowledge}
        />

        {/* Claim Rewards Modal */}
        <ClaimRewardsModal
          isOpen={claimRewardsModal}
          onClose={() => setClaimRewardsModal(false)}
        />
      </div>
    </div>
  );
};

export default MarketsTable;
