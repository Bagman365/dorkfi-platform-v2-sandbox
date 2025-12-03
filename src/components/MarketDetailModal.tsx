
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SupplyBorrowCongrats from "./SupplyBorrowCongrats";

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

const MarketDetailModal = ({ isOpen, onClose, asset, marketData }: MarketDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<"deposit" | "borrow">("deposit");
  const [amount, setAmount] = useState("");
  const [fiatValue, setFiatValue] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMode, setSuccessMode] = useState<"deposit" | "borrow">("deposit");
  const [successAmount, setSuccessAmount] = useState("");

  // Mock user data
  const mockUserData = {
    walletBalance: 50000,
    walletBalanceUSD: 350000,
  };

  // Calculate token price
  const tokenPrice = marketData.totalSupply > 0 
    ? marketData.totalSupplyUSD / marketData.totalSupply 
    : 0;

  const liquidity = marketData.totalSupply - marketData.totalBorrow;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setShowSuccess(false);
      setAmount("");
      setFiatValue(0);
    }
  }, [isOpen]);

  // Calculate fiat value when amount changes
  useEffect(() => {
    if (amount) {
      const numAmount = parseFloat(amount);
      setFiatValue(numAmount * tokenPrice);
    } else {
      setFiatValue(0);
    }
  }, [amount, tokenPrice]);

  const handleMaxClick = () => {
    if (activeTab === "deposit") {
      setAmount(mockUserData.walletBalance.toString());
    } else {
      const maxBorrowAmount = Math.floor(liquidity * 0.8);
      setAmount(maxBorrowAmount.toString());
    }
  };

  const handleSubmit = () => {
    setSuccessMode(activeTab);
    setSuccessAmount(amount);
    setTimeout(() => {
      setShowSuccess(true);
    }, 300);
  };

  const handleViewTransaction = () => {
    window.open("https://testnet.algoexplorer.io/", "_blank");
  };

  const handleGoToPortfolio = () => {
    onClose();
    window.location.href = "/";
  };

  const handleMakeAnother = () => {
    setShowSuccess(false);
    setAmount("");
    setFiatValue(0);
  };

  const isValidAmount = amount && parseFloat(amount) > 0;
  const supplyUtilization = (marketData.totalSupplyUSD / marketData.supplyCapUSD) * 100;

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-gray-200/50 dark:border-ocean-teal/20 shadow-xl p-6">
          <DialogTitle className="sr-only">Transaction Complete</DialogTitle>
          <SupplyBorrowCongrats
            transactionType={successMode}
            asset={asset}
            assetIcon={marketData.icon}
            amount={successAmount}
            onViewTransaction={handleViewTransaction}
            onGoToPortfolio={handleGoToPortfolio}
            onMakeAnother={handleMakeAnother}
            onClose={onClose}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
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
          {/* Price Display and Inline Form - Top Section */}
          <Card className="border-ocean-teal/30 dark:border-ocean-teal/40 bg-gradient-to-r from-ocean-teal/5 to-ocean-blue/5 dark:from-ocean-teal/10 dark:to-ocean-blue/10">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Price Section */}
                <div className="flex items-center gap-3 lg:border-r lg:border-ocean-teal/20 lg:pr-6">
                  <div className="text-sm text-slate-600 dark:text-slate-300">Current Price:</div>
                  <div className="text-2xl font-bold text-slate-800 dark:text-white">
                    ${tokenPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                {/* Inline Form with Tabs */}
                <div className="flex-1">
                  <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as "deposit" | "borrow"); setAmount(""); }} className="w-full">
                    <TabsList className="w-full grid grid-cols-2 bg-slate-100 dark:bg-slate-800 mb-4">
                      <TabsTrigger 
                        value="deposit" 
                        className="data-[state=active]:bg-ocean-teal data-[state=active]:text-white font-semibold"
                      >
                        Deposit
                      </TabsTrigger>
                      <TabsTrigger 
                        value="borrow" 
                        className="data-[state=active]:bg-whale-gold data-[state=active]:text-black font-semibold"
                      >
                        Borrow
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="deposit" className="mt-0">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 space-y-1">
                          <Label htmlFor="deposit-amount" className="text-xs text-slate-500 dark:text-slate-400">
                            Amount to deposit
                          </Label>
                          <div className="relative">
                            <Input
                              id="deposit-amount"
                              type="number"
                              placeholder="0.0"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="bg-white/70 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-slate-800 dark:text-white pr-16 h-10"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleMaxClick}
                              className="absolute right-1 top-1/2 -translate-y-1/2 text-ocean-teal hover:bg-ocean-teal/10 h-7 px-2 text-xs"
                            >
                              MAX
                            </Button>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>≈ ${fiatValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span>Balance: {mockUserData.walletBalance.toLocaleString()} {asset}</span>
                          </div>
                        </div>
                        <Button
                          onClick={handleSubmit}
                          disabled={!isValidAmount}
                          className="bg-ocean-teal hover:bg-ocean-teal/90 text-white h-10 px-6 font-semibold sm:self-center sm:mt-5 disabled:opacity-50"
                        >
                          Deposit {asset}
                        </Button>
                      </div>
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span className="text-green-500">●</span>
                        Earn {marketData.supplyAPY}% APY on your deposit
                      </div>
                    </TabsContent>

                    <TabsContent value="borrow" className="mt-0">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 space-y-1">
                          <Label htmlFor="borrow-amount" className="text-xs text-slate-500 dark:text-slate-400">
                            Amount to borrow
                          </Label>
                          <div className="relative">
                            <Input
                              id="borrow-amount"
                              type="number"
                              placeholder="0.0"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="bg-white/70 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-slate-800 dark:text-white pr-16 h-10"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleMaxClick}
                              className="absolute right-1 top-1/2 -translate-y-1/2 text-whale-gold hover:bg-whale-gold/10 h-7 px-2 text-xs"
                            >
                              MAX
                            </Button>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>≈ ${fiatValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span>Available: {liquidity.toLocaleString()} {asset}</span>
                          </div>
                        </div>
                        <Button
                          onClick={handleSubmit}
                          disabled={!isValidAmount}
                          className="bg-whale-gold hover:bg-whale-gold/90 text-black h-10 px-6 font-semibold sm:self-center sm:mt-5 disabled:opacity-50"
                        >
                          Borrow {asset}
                        </Button>
                      </div>
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span className="text-red-500">●</span>
                        Pay {marketData.borrowAPY}% APY on your loan
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supply, Borrow, Collateral Info */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-1 gap-2">
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
          </div>

          {/* Protocol Configuration */}
          <Card className="bg-white/50 dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-800 dark:text-white flex items-center gap-2">
                ⚙️ Protocol Config
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Protocol-level configuration settings for this market</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    Reserve Factor
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Percentage of interest that goes to the protocol reserves</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="text-lg font-semibold text-slate-800 dark:text-white">{marketData.reserveFactor}%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    Liquidation Penalty
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Additional penalty paid when your position gets liquidated</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="text-lg font-semibold text-slate-800 dark:text-white">{marketData.liquidationPenalty}%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    Collector Contract
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Contract address that collects protocol fees</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <a 
                    href="#" 
                    className="text-sm text-ocean-teal hover:text-ocean-teal/80 flex items-center gap-1 truncate"
                  >
                    {marketData.collectorContract}
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarketDetailModal;
