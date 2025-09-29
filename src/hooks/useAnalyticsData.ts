import { useState, useEffect } from 'react';

export interface KPIData {
  tvl: number;
  totalBorrowed: number;
  wadCirculation: number;
  protocolRevenue: number;
  activeWallets: number;
}

export interface TVLData {
  date: string;
  total: number;
  weth: number;
  usdc: number;
  usdt: number;
  wbtc: number;
}

export interface UtilizationData {
  asset: string;
  supplied: number;
  borrowed: number;
  utilization: number;
}

export interface RevenueData {
  month: string;
  interest: number;
  liquidations: number;
  flashLoans: number;
}

export interface TreasuryData {
  holdings: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  growthData: Array<{
    date: string;
    value: number;
  }>;
}

export interface WADData {
  supplyData: Array<{
    date: string;
    supply: number;
  }>;
  collateralizationRatio: number;
  pegStability: Array<{
    date: string;
    price: number;
  }>;
}

export interface MAUData {
  month: string;
  lenders: number;
  borrowers: number;
  stakers: number;
}

export interface LoanData {
  volume: Array<{
    date: string;
    loans: number;
    repayments: number;
  }>;
  avgLoanSize: number;
}

export interface AssetDistribution {
  deposits: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  borrows: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export interface InterestRateData {
  date: string;
  wethSupply: number;
  wethBorrow: number;
  usdcSupply: number;
  usdcBorrow: number;
}

export interface HealthFactorData {
  range: string;
  count: number;
  color: string;
}

export interface LiquidationData {
  events: Array<{
    date: string;
    volume: number;
    count: number;
  }>;
  recovery: Array<{
    month: string;
    collateralRecovered: number;
    liquidatorBonuses: number;
  }>;
}

export interface DepositsData {
  date: string;
  amount: number;
}

export interface WithdrawalsData {
  date: string;
  amount: number;
}

const generateMockKPIData = (): KPIData => ({
  tvl: 245_680_000,
  totalBorrowed: 156_420_000,
  wadCirculation: 89_340_000,
  protocolRevenue: 2_150_000,
  activeWallets: 48_720,
});

const generateMockTVLData = (): TVLData[] => {
  const data: TVLData[] = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const baseTotal = 200_000_000 + (30 - i) * 1_500_000 + Math.random() * 5_000_000;
    data.push({
      date: date.toISOString().split('T')[0],
      total: baseTotal,
      weth: baseTotal * 0.35,
      usdc: baseTotal * 0.28,
      usdt: baseTotal * 0.22,
      wbtc: baseTotal * 0.15,
    });
  }
  return data;
};

const generateMockUtilizationData = (): UtilizationData[] => [
  { asset: 'WETH', supplied: 125_000_000, borrowed: 87_500_000, utilization: 70 },
  { asset: 'USDC', supplied: 68_000_000, borrowed: 40_800_000, utilization: 60 },
  { asset: 'USDT', supplied: 54_000_000, borrowed: 32_400_000, utilization: 60 },
  { asset: 'WBTC', supplied: 32_000_000, borrowed: 19_200_000, utilization: 60 },
];

const generateMockRevenueData = (): RevenueData[] => [
  { month: 'Oct', interest: 850_000, liquidations: 120_000, flashLoans: 45_000 },
  { month: 'Nov', interest: 920_000, liquidations: 156_000, flashLoans: 52_000 },
  { month: 'Dec', interest: 1_100_000, liquidations: 89_000, flashLoans: 61_000 },
  { month: 'Jan', interest: 1_350_000, liquidations: 234_000, flashLoans: 78_000 },
  { month: 'Feb', interest: 1_180_000, liquidations: 167_000, flashLoans: 69_000 },
  { month: 'Mar', interest: 1_450_000, liquidations: 198_000, flashLoans: 85_000 },
];

const generateMockTreasuryData = (): TreasuryData => ({
  holdings: [
    { name: 'WETH', value: 12_500_000, color: 'hsl(var(--ocean-teal))' },
    { name: 'USDC', value: 8_900_000, color: 'hsl(var(--whale-gold))' },
    { name: 'Protocol Tokens', value: 6_200_000, color: 'hsl(var(--highlight-aqua))' },
    { name: 'Other', value: 2_800_000, color: 'hsl(var(--muted))' },
  ],
  growthData: Array.from({ length: 90 }, (_, i) => ({
    date: new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: 25_000_000 + i * 150_000 + Math.random() * 1_000_000,
  })),
});

const generateMockWADData = (): WADData => ({
  supplyData: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    supply: 80_000_000 + i * 300_000 + Math.random() * 500_000,
  })),
  collateralizationRatio: 135.4,
  pegStability: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    price: 1.0 + (Math.random() - 0.5) * 0.02,
  })),
});

const generateMockMAUData = (): MAUData[] => [
  { month: 'Oct', lenders: 15_200, borrowers: 8_900, stakers: 12_300 },
  { month: 'Nov', lenders: 16_800, borrowers: 9_650, stakers: 13_100 },
  { month: 'Dec', lenders: 18_200, borrowers: 10_400, stakers: 14_200 },
  { month: 'Jan', lenders: 19_500, borrowers: 11_200, stakers: 15_800 },
  { month: 'Feb', lenders: 18_900, borrowers: 10_800, stakers: 15_200 },
  { month: 'Mar', lenders: 21_300, borrowers: 12_100, stakers: 16_900 },
];

const generateMockLoanData = (): LoanData => ({
  volume: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    loans: 2_500_000 + Math.random() * 1_000_000,
    repayments: 2_200_000 + Math.random() * 800_000,
  })),
  avgLoanSize: 45_680,
});

const generateMockAssetDistribution = (): AssetDistribution => ({
  deposits: [
    { name: 'WETH', value: 125_000_000, color: 'hsl(var(--ocean-teal))' },
    { name: 'USDC', value: 68_000_000, color: 'hsl(var(--whale-gold))' },
    { name: 'USDT', value: 54_000_000, color: 'hsl(var(--highlight-aqua))' },
    { name: 'WBTC', value: 32_000_000, color: 'hsl(var(--accent))' },
  ],
  borrows: [
    { name: 'WETH', value: 87_500_000, color: 'hsl(var(--ocean-teal))' },
    { name: 'USDC', value: 40_800_000, color: 'hsl(var(--whale-gold))' },
    { name: 'USDT', value: 32_400_000, color: 'hsl(var(--highlight-aqua))' },
    { name: 'WBTC', value: 19_200_000, color: 'hsl(var(--accent))' },
  ],
});

const generateMockInterestRateData = (): InterestRateData[] => {
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    wethSupply: 3.2 + Math.random() * 0.8,
    wethBorrow: 5.5 + Math.random() * 1.2,
    usdcSupply: 2.1 + Math.random() * 0.6,
    usdcBorrow: 4.2 + Math.random() * 0.9,
  }));
};

const generateMockHealthFactorData = (): HealthFactorData[] => [
  { range: '<1.0', count: 234, color: 'hsl(var(--destructive))' },
  { range: '1.0-1.1', count: 567, color: 'hsl(var(--warning-orange))' },
  { range: '1.1-1.2', count: 1234, color: 'hsl(var(--whale-gold))' },
  { range: '1.2-1.5', count: 2890, color: 'hsl(var(--highlight-aqua))' },
  { range: '>1.5', count: 4123, color: 'hsl(var(--ocean-teal))' },
];

const generateMockLiquidationData = (): LiquidationData => ({
  events: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    volume: Math.random() * 2_000_000,
    count: Math.floor(Math.random() * 50) + 5,
  })),
  recovery: [
    { month: 'Oct', collateralRecovered: 8_900_000, liquidatorBonuses: 890_000 },
    { month: 'Nov', collateralRecovered: 12_300_000, liquidatorBonuses: 1_230_000 },
    { month: 'Dec', collateralRecovered: 6_700_000, liquidatorBonuses: 670_000 },
    { month: 'Jan', collateralRecovered: 15_600_000, liquidatorBonuses: 1_560_000 },
    { month: 'Feb', collateralRecovered: 11_200_000, liquidatorBonuses: 1_120_000 },
    { month: 'Mar', collateralRecovered: 13_800_000, liquidatorBonuses: 1_380_000 },
  ],
});

const generateMockDepositsData = (): DepositsData[] => {
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    amount: 7_000_000 + Math.random() * 5_000_000 + Math.sin(i * 0.5) * 2_000_000,
  }));
};

const generateMockWithdrawalsData = (): WithdrawalsData[] => {
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    amount: 5_000_000 + Math.random() * 5_000_000 + Math.cos(i * 0.5) * 2_000_000,
  }));
};

export const useAnalyticsData = () => {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [tvlData, setTvlData] = useState<TVLData[]>([]);
  const [utilizationData, setUtilizationData] = useState<UtilizationData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [treasuryData, setTreasuryData] = useState<TreasuryData | null>(null);
  const [wadData, setWadData] = useState<WADData | null>(null);
  const [mauData, setMauData] = useState<MAUData[]>([]);
  const [loanData, setLoanData] = useState<LoanData | null>(null);
  const [assetDistribution, setAssetDistribution] = useState<AssetDistribution | null>(null);
  const [interestRateData, setInterestRateData] = useState<InterestRateData[]>([]);
  const [healthFactorData, setHealthFactorData] = useState<HealthFactorData[]>([]);
  const [liquidationData, setLiquidationData] = useState<LiquidationData | null>(null);
  const [depositsData, setDepositsData] = useState<DepositsData[]>([]);
  const [withdrawalsData, setWithdrawalsData] = useState<WithdrawalsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const loadData = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setKpiData(generateMockKPIData());
      setTvlData(generateMockTVLData());
      setUtilizationData(generateMockUtilizationData());
      setRevenueData(generateMockRevenueData());
      setTreasuryData(generateMockTreasuryData());
      setWadData(generateMockWADData());
      setMauData(generateMockMAUData());
      setLoanData(generateMockLoanData());
      setAssetDistribution(generateMockAssetDistribution());
      setInterestRateData(generateMockInterestRateData());
      setHealthFactorData(generateMockHealthFactorData());
      setLiquidationData(generateMockLiquidationData());
      setDepositsData(generateMockDepositsData());
      setWithdrawalsData(generateMockWithdrawalsData());
      
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    kpiData,
    tvlData,
    utilizationData,
    revenueData,
    treasuryData,
    wadData,
    mauData,
    loanData,
    assetDistribution,
    interestRateData,
    healthFactorData,
    liquidationData,
    depositsData,
    withdrawalsData,
    loading,
  };
};