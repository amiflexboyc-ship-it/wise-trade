import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TransactionHistory from "../components/TransactionHistory";
import OrderHistory from "../components/OrderHistory";
import TradingChart from "../components/TradingChart";
import WalletActions from "../components/WalletActions";
import { useTrading } from "../context/TradingContext";
import { getMarketPrices } from "../Services/MarketApi";
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  PlusCircle,
  Coins,
  ChevronRight,
} from "lucide-react";

function Dashboard() {
  const { wallet, user, setSelectedSymbol, resetDemoAccount } = useTrading();

  const [markets, setMarkets] = useState([]);
  const [marketLoading, setMarketLoading] = useState(true);

  // LOAD LIVE MARKET PRICES
  useEffect(() => {
    let mounted = true;

    const loadMarkets = async () => {
      try {
        const data = await getMarketPrices();
        if (mounted) {
          setMarkets(data || []);
          setMarketLoading(false);
        }
      } catch (error) {
        if (mounted) setMarketLoading(false);
      }
    };

    loadMarkets();
    const interval = setInterval(loadMarkets, 4000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Price helper
  const getPrice = (symbol) => {
    const coin = markets.find((m) => m.symbol === symbol);
    return Number(coin?.price || (symbol === "BTCUSDT" ? 88450 : symbol === "ETHUSDT" ? 3180 : symbol === "SOLUSDT" ? 184 : 620));
  };

  const usdt = Number(wallet?.USDT || 0);
  const btc = Number(wallet?.BTC || 0);
  const eth = Number(wallet?.ETH || 0);
  const bnb = Number(wallet?.BNB || 0);
  const sol = Number(wallet?.SOL || 0);
  const xrp = Number(wallet?.XRP || 0);
  const ada = Number(wallet?.ADA || 0);
  const doge = Number(wallet?.DOGE || 0);
  const avax = Number(wallet?.AVAX || 0);

  const btcPrice = getPrice("BTCUSDT");
  const ethPrice = getPrice("ETHUSDT");
  const solPrice = getPrice("SOLUSDT");
  const bnbPrice = getPrice("BNBUSDT");
  const xrpPrice = getPrice("XRPUSDT");
  const adaPrice = getPrice("ADAUSDT");
  const dogePrice = getPrice("DOGEUSDT");
  const avaxPrice = getPrice("AVAXUSDT");

  const btcValue = btc * btcPrice;
  const ethValue = eth * ethPrice;
  const solValue = sol * solPrice;
  const bnbValue = bnb * bnbPrice;
  const xrpValue = xrp * xrpPrice;
  const adaValue = ada * adaPrice;
  const dogeValue = doge * dogePrice;
  const avaxValue = avax * avaxPrice;

  const cryptoValue = btcValue + ethValue + solValue + bnbValue + xrpValue + adaValue + dogeValue + avaxValue;
  const portfolioValue = usdt + cryptoValue;

  const initialBalance = Number(wallet?.initialBalance || 10000);
  const profitLoss = portfolioValue - initialBalance;
  const profitLossPct = initialBalance > 0 ? (profitLoss / initialBalance) * 100 : 0;

  const formatMoney = (val) => {
    return Number(val || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="min-h-screen bg-[#07090e] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1700px] space-y-6">
        {/* TOP WELCOME & VIP HEADER */}
        <header className="flex flex-col gap-4 rounded-2xl border border-slate-800/80 bg-gradient-to-r from-[#0c101a] via-[#111726] to-[#0c101a] p-5 sm:p-6 sm:flex-row sm:items-center sm:justify-between shadow-2xl">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="rounded-md bg-[#F0B90B]/15 px-2.5 py-0.5 text-xs font-bold text-[#F0B90B] border border-[#F0B90B]/30 flex items-center gap-1">
                <ShieldCheck size={14} />
                <span>WiseTrade VIP Tier 1</span>
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#0ecb81]">
                <span className="h-2 w-2 rounded-full bg-[#0ecb81] animate-ping" />
                Live Feed
              </span>
            </div>

            <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Welcome back, <span className="font-semibold text-slate-200">{user?.displayName || user?.email || "Trader"}</span>
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/trade"
              className="flex items-center gap-1.5 rounded-xl bg-[#F0B90B] px-4 py-2.5 text-xs font-black text-black transition hover:bg-[#fcd535] shadow-lg shadow-[#F0B90B]/20"
            >
              <Zap size={15} />
              <span>Trade Now</span>
            </Link>

            <Link
              to="/wallet"
              className="flex items-center gap-1.5 rounded-xl bg-slate-800/90 px-4 py-2.5 text-xs font-bold text-slate-200 transition hover:bg-slate-700 hover:text-white border border-slate-700/60"
            >
              <Wallet size={15} />
              <span>Deposit / Withdraw</span>
            </Link>

            <button
              type="button"
              onClick={resetDemoAccount}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-medium text-slate-400 transition hover:text-white hover:bg-slate-800 border border-slate-800"
              title="Reset Demo Account to $10,000"
            >
              <RotateCcw size={14} />
              <span className="hidden md:inline">Reset Balances</span>
            </button>
          </div>
        </header>

        {/* 5 KPI METRIC CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {/* TOTAL BALANCE */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Portfolio</span>
              <Coins size={16} className="text-[#F0B90B]" />
            </div>
            <p className="mt-2 text-2xl font-black text-white tabular-nums tracking-tight">
              ${formatMoney(portfolioValue)}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
              <span>USDT + 8 Crypto Assets</span>
            </div>
          </div>

          {/* NET P&L */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Net P&L</span>
              <TrendingUp size={16} className={profitLoss >= 0 ? "text-[#0ecb81]" : "text-[#f6465d]"} />
            </div>
            <p
              className={`mt-2 text-2xl font-black tabular-nums tracking-tight ${
                profitLoss >= 0 ? "text-[#0ecb81]" : "text-[#f6465d]"
              }`}
            >
              {profitLoss >= 0 ? "+" : "-"}${formatMoney(Math.abs(profitLoss))}
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs">
              <span
                className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                  profitLoss >= 0
                    ? "bg-[#0ecb81]/15 text-[#0ecb81]"
                    : "bg-[#f6465d]/15 text-[#f6465d]"
                }`}
              >
                {profitLoss >= 0 ? "+" : ""}{profitLossPct.toFixed(2)}%
              </span>
              <span className="text-slate-500">all-time ROI</span>
            </div>
          </div>

          {/* AVAILABLE CASH (USDT) */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Available Cash</span>
              <span className="text-[10px] text-[#0ecb81] font-bold">READY</span>
            </div>
            <p className="mt-2 text-2xl font-black text-[#F0B90B] tabular-nums tracking-tight">
              ${formatMoney(usdt)}
            </p>
            <p className="mt-2 text-xs text-slate-400">Ready to execute trades</p>
          </div>

          {/* CRYPTO PORTFOLIO VALUE */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Crypto Holdings</span>
              <span className="text-[10px] text-sky-400 font-bold">ALLOCATED</span>
            </div>
            <p className="mt-2 text-2xl font-black text-white tabular-nums tracking-tight">
              ${formatMoney(cryptoValue)}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              {((cryptoValue / (portfolioValue || 1)) * 100).toFixed(1)}% of total capital
            </p>
          </div>

          {/* PLATFORM WIN RATE & HEALTH */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Engine Status</span>
              <span className="h-2 w-2 rounded-full bg-[#0ecb81]" />
            </div>
            <p className="mt-2 text-2xl font-black text-white tabular-nums tracking-tight">
              99.98%
            </p>
            <p className="mt-2 text-xs text-[#0ecb81] font-semibold">Sub-millisecond execution</p>
          </div>
        </div>

        {/* ASSET ALLOCATION PREVIEW */}
        <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Your Asset Balances</h2>
              <p className="text-xs text-slate-400 mt-0.5">Live market valuation & crypto quantities</p>
            </div>
            <Link
              to="/wallet"
              className="flex items-center gap-1 text-xs font-semibold text-[#F0B90B] hover:underline"
            >
              <span>Manage Wallet</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {[
              { sym: "BTC", amount: btc, price: btcPrice, val: btcValue },
              { sym: "ETH", amount: eth, price: ethPrice, val: ethValue },
              { sym: "SOL", amount: sol, price: solPrice, val: solValue },
              { sym: "BNB", amount: bnb, price: bnbPrice, val: bnbValue },
              { sym: "XRP", amount: xrp, price: xrpPrice, val: xrpValue },
              { sym: "ADA", amount: ada, price: adaPrice, val: adaValue },
              { sym: "DOGE", amount: doge, price: dogePrice, val: dogeValue },
              { sym: "AVAX", amount: avax, price: avaxPrice, val: avaxValue },
            ].map((coin) => (
              <div
                key={coin.sym}
                onClick={() => setSelectedSymbol(`${coin.sym}USDT`)}
                className="group cursor-pointer rounded-xl border border-slate-800/70 bg-[#121724] p-3 transition hover:border-[#F0B90B]/50 hover:bg-[#161d2e]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white group-hover:text-[#F0B90B] transition">
                    {coin.sym}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ${coin.price > 10 ? coin.price.toLocaleString(undefined, { maximumFractionDigits: 0 }) : coin.price.toFixed(3)}
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-white tabular-nums">
                  {coin.amount.toFixed(coin.sym === "BTC" || coin.sym === "ETH" ? 4 : 2)}
                </p>
                <p className="mt-0.5 text-xs text-slate-400 font-mono">
                  ${coin.val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* TRADING CHART & QUICK TERMINAL */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* MAIN CHART (8 cols) */}
          <div className="xl:col-span-8 space-y-6">
            <TradingChart />
            <OrderHistory limit={5} />
            <TransactionHistory />
          </div>

          {/* RIGHT SIDEBAR (4 cols): WATCHLIST & ACTIONS */}
          <aside className="xl:col-span-4 space-y-6">
            {/* HOT MARKETS WATCHLIST */}
            <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-4 sm:p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800/70 pb-3 mb-3">
                <h3 className="font-bold text-sm text-white">Live Market Watchlist</h3>
                <Link to="/market" className="text-xs text-[#F0B90B] hover:underline">
                  All Markets →
                </Link>
              </div>

              <div className="divide-y divide-slate-800/50">
                {markets.slice(0, 7).map((coin) => (
                  <div
                    key={coin.symbol}
                    onClick={() => setSelectedSymbol(coin.symbol)}
                    className="flex items-center justify-between py-2.5 hover:bg-slate-800/40 px-2 rounded-xl cursor-pointer transition"
                  >
                    <div>
                      <p className="font-bold text-sm text-white">{coin.base}/USDT</p>
                      <p className="text-[11px] text-slate-500">{coin.name}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-mono font-bold text-sm text-white tabular-nums">
                        ${coin.price.toLocaleString(undefined, { minimumFractionDigits: coin.price > 10 ? 2 : 4 })}
                      </p>
                      <p
                        className={`text-xs font-semibold tabular-nums ${
                          coin.change24h >= 0 ? "text-[#0ecb81]" : "text-[#f6465d]"
                        }`}
                      >
                        {coin.change24h >= 0 ? "+" : ""}{coin.change24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WALLET QUICK ACTION WIDGET */}
            <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-xl">
              <h3 className="font-bold text-sm text-white mb-2">Instant Funds Simulator</h3>
              <p className="text-xs text-slate-400 mb-4">
                Instantly deposit or withdraw simulated USDT into your paper trading wallet.
              </p>
              <WalletActions />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
