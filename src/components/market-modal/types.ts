
export interface PricePoint {
  time: string;
  price: number;
}

export interface MarketData {
  icon: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  priceHistory: PricePoint[];
  totalSupply: number;
  totalBorrow: number;
  availableLiquidity: number;
  utilization: number;
  supplyAPY: number;
  borrowAPY: number;
  maxLTV: number;
  liquidationThreshold: number;
  liquidationBonus: number;
  reserveFactor: number;
  supplyCap: number;
  borrowCap: number;
  oracleStatus: 'live' | 'stale';
  auditProvider: string;
}

export interface UserPosition {
  supplied: number;
  borrowed: number;
  withdrawable: number;
  borrowable: number;
  healthFactor: number;
  earnings: number;
}

export interface PremiumMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: string;
  chainId?: 'voi' | 'algorand';
  marketData: MarketData;
  userPosition?: UserPosition;
  onDeposit?: () => void;
  onWithdraw?: () => void;
  onBorrow?: () => void;
  onRepay?: () => void;
}
