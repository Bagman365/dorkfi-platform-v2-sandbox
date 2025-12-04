
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, TrendingUp, TrendingDown, ChevronDown, ChevronUp, Calculator, Wallet } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import SupplyBorrowModal from "@/components/SupplyBorrowModal";

interface MarketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: string;
  marketData: {
    icon: string;
    totalSupply: number;
    totalSupplyUSD: number;
    supplyAPY: number;
    totalBorrow: number;
    totalBorrowUSD: number;
    borrowAPY: number;
    utilization: number;
    collateralFactor: number;
    supplyCap: number;
    supplyCapUSD: number;
    maxLTV: number;
    liquidationThreshold: number;
    liquidationPenalty: number;
    reserveFactor: number;
    collectorContract: string;
  };
}

const tokenNames: Record<string, string> = {
  VOI: "VOI – Voi Network",
  UNIT: "UNIT – Unit Protocol",
  USDC: "USDC – USD Coin",
  ALGO: "ALGO – Algorand",
  ETH: "ETH – Ethereum",
  BTC: "BTC – Bitcoin"
};

// Generate mock 7-day price history based on current price
const generatePriceHistory = (currentPrice: number, isPositiveTrend: boolean) => {
  const data = [];
  const volatility = currentPrice * 0.03; // 3% volatility
  let price = isPositiveTrend ? currentPrice * 0.97 : currentPrice * 1.03;
  
  for (let i = 0; i < 7; i++) {
    const change = (Math.random() - 0.5) * volatility;
    const trend = isPositiveTrend ? (currentPrice - price) / 7 : (price - currentPrice) / 7;
    price = price + change + trend;
    data.push({ day: i, price: Math.max(price, 0) });
  }
  // Ensure last point is close to current price
  data[6].price = currentPrice;
  return data;
};

// Mock user position data
const mockUserPosition = {
  hasPosition: true,
  supplied: 500,
  suppliedUSD: 500,
  borrowed: 0,
  borrowedUSD: 0,
  earnings: 2.50,
  healthFactor: 2.45
};

const MarketDetailModal = ({ isOpen, onClose, asset, marketData }: MarketDetailModalProps) => {
  const [supplyModal, setSupplyModal] = useState({ isOpen: false, asset: null as string | null });
  const [borrowModal, setBorrowModal] = useState({ isOpen: false, asset: null as string | null });
  const [positionExpanded, setPositionExpanded] = useState(mockUserPosition.hasPosition);
  const [calcAmount, setCalcAmount] = useState([1000]);
  const [calcPeriod, setCalcPeriod] = useState<'1M' | '6M' | '1Y'>('1Y');

  const handleSupplyClick = () => {
    setSupplyModal({ isOpen: true, asset });
  };

  const handleBorrowClick = () => {
    setBorrowModal({ isOpen: true, asset });
  };

  const handleCloseSupplyModal = () => {
    setSupplyModal({ isOpen: false, asset: null });
  };

  const handleCloseBorrowModal = () => {
    setBorrowModal({ isOpen: false, asset: null });
  };

  const getAssetData = () => ({
    icon: marketData.icon,
    totalSupply: marketData.totalSupply,
    totalSupplyUSD: marketData.totalSupplyUSD,
    supplyAPY: marketData.supplyAPY,
    totalBorrow: marketData.totalBorrow,
    totalBorrowUSD: marketData.totalBorrowUSD,
    borrowAPY: marketData.borrowAPY,
    utilization: marketData.utilization,
    collateralFactor: marketData.collateralFactor,
    liquidity: marketData.totalSupply - marketData.totalBorrow,
    liquidityUSD: marketData.totalSupplyUSD - marketData.totalBorrowUSD,
  });

  const supplyUtilization = (marketData.totalSupplyUSD / marketData.supplyCapUSD) * 100;
  
  // Calculate token price from total supply data
  const tokenPrice = marketData.totalSupply > 0 
    ? marketData.totalSupplyUSD / marketData.totalSupply 
    : 0;

  // Mock 24h price change - in production this would come from API
  const priceChange24h = ((asset.charCodeAt(0) % 10) - 5) + (Math.random() * 2 - 1);
  const isPricePositive = priceChange24h >= 0;

  // Generate sparkline data
  const sparklineData = useMemo(() => generatePriceHistory(tokenPrice, isPricePositive), [tokenPrice, isPricePositive]);

  // Calculate available liquidity
  const availableLiquidity = marketData.totalSupply - marketData.totalBorrow;
  const availableLiquidityUSD = marketData.totalSupplyUSD - marketData.totalBorrowUSD;
  const liquidityPercent = marketData.totalSupply > 0 
    ? ((availableLiquidity / marketData.totalSupply) * 100) 
    : 0;

  // Calculator logic
  const periodMonths = calcPeriod === '1M' ? 1 : calcPeriod === '6M' ? 6 : 12;
  const supplyEarnings = (calcAmount[0] * (marketData.supplyAPY / 100) * (periodMonths / 12));
  const borrowCost = (calcAmount[0] * (marketData.borrowAPY / 100) * (periodMonths / 12));

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-gray-200/50 dark:border-ocean-teal/20 shadow-xl card-hover hover:shadow-lg hover:border-ocean-teal/40 transition-all p-6">
          <DialogHeader className="pb-4">
            <DialogTitle className="sr-only">{tokenNames[asset] || asset} Market Details</DialogTitle>
            <div className="flex items-center gap-3">
              <img src={marketData.icon} alt={asset} className="w-10 h-10 rounded-full" />
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  {tokenNames[asset] || asset}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-base">Reserve Status & Configuration</p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Top Section: Price, Liquidity, Actions - 3 columns on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
              {/* Price Card with Sparkline */}
              <Card className="border-ocean-teal/30 dark:border-ocean-teal/40 bg-gradient-to-r from-ocean-teal/5 to-ocean-blue/5 dark:from-ocean-teal/10 dark:to-ocean-blue/10">
                <CardContent className="p-4 h-full flex flex-col justify-between">
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">Current Price</div>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-slate-800 dark:text-white">
                        ${tokenPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <Badge 
                        className={`flex items-center gap-1 ${
                          isPricePositive 
                            ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' 
                            : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                        }`}
                      >
                        {isPricePositive ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {isPricePositive ? '+' : ''}{priceChange24h.toFixed(2)}%
                      </Badge>
                    </div>
                  </div>
                  {/* Sparkline Chart */}
                  <div className="mt-2">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">7D Trend</div>
                    <div className="h-10 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id={`gradient-${asset}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={isPricePositive ? "#10b981" : "#ef4444"} stopOpacity={0.4} />
                              <stop offset="100%" stopColor={isPricePositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area 
                            type="monotone" 
                            dataKey="price" 
                            stroke={isPricePositive ? "#10b981" : "#ef4444"} 
                            strokeWidth={2}
                            fill={`url(#gradient-${asset})`}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Available Liquidity Card */}
              <Card className="border-ocean-blue/30 dark:border-ocean-blue/40 bg-gradient-to-r from-ocean-blue/5 to-cyan-500/5 dark:from-ocean-blue/10 dark:to-cyan-500/10">
                <CardContent className="p-4 h-full flex flex-col justify-between">
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                      Available Liquidity
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Amount available to borrow from this market</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                      {availableLiquidity.toLocaleString(undefined, { maximumFractionDigits: 0 })} {asset}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      ${availableLiquidityUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>{liquidityPercent.toFixed(1)}% available</span>
                      <span>{(100 - liquidityPercent).toFixed(1)}% borrowed</span>
                    </div>
                    <Progress value={liquidityPercent} className="h-2 bg-slate-200 dark:bg-slate-700" />
                  </div>
                </CardContent>
              </Card>

              {/* Actions Card */}
              <Card className="border-ocean-teal/30 dark:border-ocean-teal/40 bg-gradient-to-r from-ocean-teal/5 to-ocean-blue/5 dark:from-ocean-teal/10 dark:to-ocean-blue/10 sm:col-span-2 lg:col-span-1">
                <CardContent className="p-4 h-full flex items-center justify-center">
                  <div className="flex gap-3 w-full">
                    <Button
                      onClick={handleSupplyClick}
                      className="flex-1 bg-ocean-teal hover:bg-ocean-teal/90 text-white h-10 px-6 text-base font-semibold"
                    >
                      Deposit {asset}
                    </Button>
                    <Button
                      onClick={handleBorrowClick}
                      variant="outline"
                      className="flex-1 border-ocean-teal text-ocean-teal hover:bg-ocean-teal/10 dark:border-ocean-teal dark:text-ocean-teal h-10 px-6 text-base font-semibold"
                    >
                      Borrow {asset}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Row 1: Supply Info | Borrow Info */}
            <div className="grid lg:grid-cols-2 gap-4 auto-rows-fr">
              {/* Supply Information */}
              <Card className="border-green-200 dark:border-green-800 bg-white/50 dark:bg-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700 dark:text-green-400 flex items-center gap-2">
                    🟢 Supply Information
                    <Tooltip>
                       <TooltipTrigger asChild>
                         <Info className="h-4 w-4 text-gray-500" />
                       </TooltipTrigger>
                      <TooltipContent>
                        <p>Information about the total assets supplied to this market</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="relative w-20 h-20">
                      <div className="w-full h-full rounded-full border-4 border-gray-200 dark:border-slate-600">
                        <div 
                          className="absolute inset-0 rounded-full border-4 border-green-500"
                          style={{
                            background: `conic-gradient(#10b981 ${supplyUtilization * 3.6}deg, transparent 0deg)`
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                           <div className="text-lg font-bold text-slate-800 dark:text-white">
                             {supplyUtilization.toFixed(1)}%
                          </div>
                          <div className="text-xs text-slate-800 dark:text-white">Used</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-sm font-semibold text-slate-800 dark:text-white flex items-center justify-center gap-1">
                      ${marketData.totalSupplyUSD.toLocaleString()} / ${marketData.supplyCapUSD.toLocaleString()}
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Current supply vs maximum supply cap allowed for this asset</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        APY: {marketData.supplyAPY}%
                      </Badge>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Annual Percentage Yield earned by supplying this asset</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Borrow Information */}
              <Card className="border-red-200 dark:border-red-800 bg-white/50 dark:bg-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700 dark:text-red-400 flex items-center gap-2">
                    🟥 Borrow Information
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Information about borrowing activity for this asset</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="relative w-20 h-20">
                      <div className="w-full h-full rounded-full border-4 border-gray-200 dark:border-slate-600">
                        <div 
                          className="absolute inset-0 rounded-full border-4 border-red-500"
                          style={{
                            background: `conic-gradient(#ef4444 ${marketData.utilization * 3.6}deg, transparent 0deg)`
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                           <div className="text-lg font-bold text-slate-800 dark:text-white">
                             {marketData.utilization}%
                          </div>
                          <div className="text-xs text-slate-800 dark:text-white">Util</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-sm font-semibold text-slate-800 dark:text-white flex items-center justify-center gap-1">
                      {marketData.totalBorrow.toLocaleString()} {asset}
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total amount of {asset} currently borrowed from this market</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Badge className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                        APY: {marketData.borrowAPY}%
                      </Badge>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Annual Percentage Yield paid when borrowing this asset</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Row 2: Collateral Info | Earnings Calculator */}
            <div className="grid lg:grid-cols-2 gap-4 auto-rows-fr">
              {/* Collateral Information */}
              <Card className="border-yellow-200 dark:border-yellow-800 bg-white/50 dark:bg-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                    🟨 Collateral Info
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Information about using this asset as collateral for borrowing</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-center gap-1">
                    <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1">
                      ✅ Usable as collateral
                    </Badge>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This asset can be used as collateral to borrow other assets</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded text-center">
                      <div className="text-lg font-bold text-slate-800 dark:text-white flex items-center justify-center gap-1">
                        {marketData.maxLTV}%
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Maximum Loan-to-Value ratio - the maximum you can borrow against this collateral</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">Max LTV</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded text-center">
                      <div className="text-lg font-bold text-slate-800 dark:text-white flex items-center justify-center gap-1">
                        {marketData.liquidationThreshold}%
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>When your loan-to-value exceeds this threshold, your position becomes eligible for liquidation</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">Liq. Threshold</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Earnings Calculator */}
              <Card className="border-cyan-200 dark:border-cyan-800/50 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 dark:from-cyan-900/20 dark:to-blue-900/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-cyan-700 dark:text-cyan-400 flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Earnings Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">Amount</span>
                      <span className="font-semibold text-slate-800 dark:text-white">${calcAmount[0].toLocaleString()}</span>
                    </div>
                    <Slider
                      value={calcAmount}
                      onValueChange={setCalcAmount}
                      min={100}
                      max={100000}
                      step={100}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Time Period</div>
                    <div className="flex gap-2">
                      {(['1M', '6M', '1Y'] as const).map((period) => (
                        <Button
                          key={period}
                          variant={calcPeriod === period ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCalcPeriod(period)}
                          className={calcPeriod === period 
                            ? "bg-ocean-teal hover:bg-ocean-teal/90 text-white" 
                            : "border-ocean-teal/50 text-ocean-teal hover:bg-ocean-teal/10"
                          }
                        >
                          {period === '1M' ? '1 Month' : period === '6M' ? '6 Months' : '1 Year'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-1 text-green-700 dark:text-green-400 text-xs font-medium mb-1">
                        <TrendingUp className="h-3 w-3" />
                        Supply
                      </div>
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        +${supplyEarnings.toFixed(2)}
                      </div>
                      <div className="text-xs text-green-600/70 dark:text-green-400/70">
                        {marketData.supplyAPY}% APY
                      </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-1 text-red-700 dark:text-red-400 text-xs font-medium mb-1">
                        <TrendingDown className="h-3 w-3" />
                        Borrow
                      </div>
                      <div className="text-lg font-bold text-red-600 dark:text-red-400">
                        -${borrowCost.toFixed(2)}
                      </div>
                      <div className="text-xs text-red-600/70 dark:text-red-400/70">
                        {marketData.borrowAPY}% APY
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Position Summary - Collapsible */}
            <Collapsible open={positionExpanded} onOpenChange={setPositionExpanded}>
              <Card className="border-purple-200 dark:border-purple-800/50 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-900/20 dark:to-indigo-900/20">
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="pb-2 cursor-pointer hover:bg-purple-100/30 dark:hover:bg-purple-900/30 transition-colors rounded-t-lg">
                    <CardTitle className="text-base text-purple-700 dark:text-purple-400 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        Your Position
                      </div>
                      {positionExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {mockUserPosition.hasPosition ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="text-center p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {mockUserPosition.supplied.toLocaleString()} {asset}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Supplied</div>
                          <div className="text-xs text-slate-500">${mockUserPosition.suppliedUSD.toLocaleString()}</div>
                        </div>
                        <div className="text-center p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                          <div className="text-lg font-bold text-red-600 dark:text-red-400">
                            {mockUserPosition.borrowed.toLocaleString()} {asset}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Borrowed</div>
                          <div className="text-xs text-slate-500">${mockUserPosition.borrowedUSD.toLocaleString()}</div>
                        </div>
                        <div className="text-center p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                          <div className="text-lg font-bold text-ocean-teal">
                            +${mockUserPosition.earnings.toFixed(2)}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Earnings</div>
                          <div className="text-xs text-slate-500">All time</div>
                        </div>
                        <div className="text-center p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {mockUserPosition.healthFactor.toFixed(2)}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Health Factor</div>
                          <div className="text-xs text-green-500">Safe</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-slate-600 dark:text-slate-400 mb-2">No position in this market</p>
                        <Button size="sm" onClick={handleSupplyClick} className="bg-ocean-teal hover:bg-ocean-teal/90">
                          Start Earning
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>
        </DialogContent>
      </Dialog>

      {/* Supply Modal */}
      {supplyModal.isOpen && supplyModal.asset && (
        <SupplyBorrowModal
          isOpen={supplyModal.isOpen}
          onClose={handleCloseSupplyModal}
          asset={supplyModal.asset}
          mode="deposit"
          assetData={getAssetData()}
        />
      )}

      {/* Borrow Modal */}
      {borrowModal.isOpen && borrowModal.asset && (
        <SupplyBorrowModal
          isOpen={borrowModal.isOpen}
          onClose={handleCloseBorrowModal}
          asset={borrowModal.asset}
          mode="borrow"
          assetData={getAssetData()}
        />
      )}
     </>
   );
 };

 export default MarketDetailModal;
