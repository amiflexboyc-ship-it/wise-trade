import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TransactionHistory from "../components/TransactionHistory";
import WalletActions from "../components/WalletActions";
import OrderHistory from "../components/OrderHistory";
import { useTrading } from "../context/TradingContext";
import { getMarketPrices } from "../Services/MarketApi";
import {
  Wallet as WalletIcon,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sparkles,
} from "lucide-react";

function Wallet() {
  const navigate = useNavigate();
  const { wallet, setSelectedSymbol, resetDemoAccount } = useTrading();

  const [markets, setMarkets] = useState([]);
  const [marketLoading, setMarketLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchMarkets = async () => {
      try {
        const data = await getMarketPrices();
        if (mounted) {
          setMarkets(data || []);
          setMarketLoading(false);
        }
      } catch {
        if (mounted) setMarketLoading(false);
      }
    };
    fetchMarkets();
    const timer = setInterval(fetchMarkets, 4000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const getPrice = (symbol) => {
    return Number(
      markets.find((coin) => coin.symbol === symbol)?.price ||
        (symbol === "BTCUSDT" ? 88450 : symbol === "ETHUSDT" ? 3180 : symbol === "SOLUSDT" ? 184 : 620)
    );
  };

  const USDT = Number(wallet?.USDT || 0);
  const BTC = Number(wallet?.BTC || 0);
  const ETH = Number(wallet?.ETH || 0);
  const BNB = Number(wallet?.BNB || 0);
  const SOL = Number(wallet?.SOL || 0);
  const XRP = Number(wallet?.XRP || 0);
  const ADA = Number(wallet?.ADA || 0);
  const DOGE = Number(wallet?.DOGE || 0);
  const AVAX = Number(wallet?.AVAX || 0);

  const btcPrice = getPrice("BTCUSDT");
  const ethPrice = getPrice("ETHUSDT");
  const bnbPrice = getPrice("BNBUSDT");
  const solPrice = getPrice("SOLUSDT");
  const xrpPrice = getPrice("XRPUSDT");
  const adaPrice = getPrice("ADAUSDT");
  const dogePrice = getPrice("DOGEUSDT");
  const avaxPrice = getPrice("AVAXUSDT");

  const btcValue = BTC * btcPrice;
  const ethValue = ETH * ethPrice;
  const bnbValue = BNB * bnbPrice;
  const solValue = SOL * solPrice;
  const xrpValue = XRP * xrpPrice;
  const adaValue = ADA * adaPrice;
  const dogeValue = DOGE * dogePrice;
  const avaxValue = AVAX * avaxPrice;

  const totalBalance =
    USDT + btcValue + ethValue + bnbValue + solValue + xrpValue + adaValue + dogeValue + avaxValue;

  const totalDeposits = Number(wallet?.totalDeposits || 0);
  const totalWithdrawals = Number(wallet?.totalWithdrawals || 0);

  const formatMoney = (val) => {
    return Number(val || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getPercentage = (val) => {
    if (totalBalance <= 0) return 0;
    return (val / totalBalance) * 100;
  };

  const assetsList = [
    { symbol: "USDT", name: "Tether USD", amount: USDT, price: 1, value: USDT, isStable: true },
    { symbol: "BTC", name: "Bitcoin", amount: BTC, price: btcPrice, value: btcValue },
    { symbol: "ETH", name: "Ethereum", amount: ETH, price: ethPrice, value: ethValue },
    { symbol: "SOL", name: "Solana", amount: SOL, price: solPrice, value: solValue },
    { symbol: "BNB", name: "BNB Chain", amount: BNB, price: bnbPrice, value: bnbValue },
    { symbol: "XRP", name: "Ripple", amount: XRP, price: xrpPrice, value: xrpValue },
    { symbol: "ADA", name: "Cardano", amount: ADA, price: adaPrice, value: adaValue },
    { symbol: "DOGE", name: "Dogecoin", amount: DOGE, price: dogePrice, value: dogeValue },
    { symbol: "AVAX", name: "Avalanche", amount: AVAX, price: avaxPrice, value: avaxValue },
  ];

  const handleTradeAsset = (sym) => {
    if (sym === "USDT") {
      navigate("/market");
    } else {
      setSelectedSymbol(`${sym}USDT`);
      navigate("/trade");
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] p-4 sm:p-6 lg:p-8 text-white">
      <div className="mx-auto max-w-[1700px] space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#0ecb81]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#F0B90B]">
                Custody & Balances
              </span>
            </div>
            <h1 className="mt-1 text-3xl font-black text-white tracking-tight">
              WiseTrade Vault Wallet
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage your simulated multi-chain crypto balances and transaction history
            </p>
          </div>

          <button
            type="button"
            onClick={resetDemoAccount}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 self-start sm:self-auto transition"
          >
            <RotateCcw size={14} />
            <span>Reset Demo Balances</span>
          </button>
        </div>

        {/* 4 SUMMARY STAT CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* TOTAL PORTFOLIO */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-xl">
            <p className="text-xs text-slate-400">Total Estimated Valuation</p>
            <p className="mt-2 text-3xl font-black text-white tabular-nums tracking-tight">
              ${formatMoney(totalBalance)}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#0ecb81]">
              <span>≈ {(totalBalance / (btcPrice || 88000)).toFixed(4)} BTC</span>
            </div>
          </div>

          {/* AVAILABLE CASH */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-xl">
            <p className="text-xs text-slate-400">Available USDT (Trading Cash)</p>
            <p className="mt-2 text-3xl font-black text-[#F0B90B] tabular-nums tracking-tight">
              ${formatMoney(USDT)}
            </p>
            <p className="mt-2 text-xs text-slate-400">Deployable immediately</p>
          </div>

          {/* TOTAL DEPOSITS */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-xl">
            <p className="text-xs text-slate-400">Total Lifetime Deposits</p>
            <p className="mt-2 text-3xl font-black text-[#0ecb81] tabular-nums tracking-tight">
              +${formatMoney(totalDeposits)}
            </p>
            <p className="mt-2 text-xs text-slate-400">Simulated credits</p>
          </div>

          {/* TOTAL WITHDRAWALS */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-xl">
            <p className="text-xs text-slate-400">Total Lifetime Withdrawals</p>
            <p className="mt-2 text-3xl font-black text-[#f6465d] tabular-nums tracking-tight">
              -${formatMoney(totalWithdrawals)}
            </p>
            <p className="mt-2 text-xs text-slate-400">Simulated outbound</p>
          </div>
        </div>

        {/* QUICK DEPOSIT / WITHDRAW ACTION BAR */}
        <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Instant Wallet Actions</h2>
              <p className="text-xs text-slate-400">
                Deposit or withdraw simulated USDT via TRC20, ERC20, BEP20, or Solana
              </p>
            </div>
          </div>
          <WalletActions />
        </div>

        {/* ASSET BALANCES TABLE */}
        <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0c101a] shadow-xl">
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Asset Balances</h2>
              <p className="text-xs text-slate-400">Detailed breakdown of held tokens</p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {assetsList.length} Supported Cryptocurrencies
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-xs">
              <thead className="border-b border-slate-800/80 bg-[#090d16] text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-4 px-5">Asset</th>
                  <th className="py-4 px-5">Holding</th>
                  <th className="py-4 px-5">Live Price</th>
                  <th className="py-4 px-5">Total Value (USD)</th>
                  <th className="py-4 px-5">Portfolio %</th>
                  <th className="py-4 px-5 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/40">
                {assetsList.map((coin) => {
                  const pct = getPercentage(coin.value);
                  return (
                    <tr key={coin.symbol} className="hover:bg-slate-800/40 transition">
                      {/* Asset */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 font-black text-[#F0B90B] text-xs border border-slate-700">
                            {coin.symbol.slice(0, 3)}
                          </div>
                          <div>
                            <span className="font-bold text-white text-sm block">{coin.symbol}</span>
                            <span className="text-[11px] text-slate-500">{coin.name}</span>
                          </div>
                        </div>
                      </td>

                      {/* Holding */}
                      <td className="py-4 px-5 font-mono font-bold text-white tabular-nums">
                        {coin.amount.toFixed(coin.symbol === "USDT" || coin.symbol === "DOGE" ? 2 : 4)} {coin.symbol}
                      </td>

                      {/* Live Price */}
                      <td className="py-4 px-5 font-mono text-slate-300 tabular-nums">
                        ${coin.isStable ? "1.00" : coin.price.toLocaleString(undefined, { minimumFractionDigits: coin.price > 10 ? 2 : 4 })}
                      </td>

                      {/* Total Value */}
                      <td className="py-4 px-5 font-mono font-bold text-white tabular-nums text-sm">
                        ${formatMoney(coin.value)}
                      </td>

                      {/* Portfolio % */}
                      <td className="py-4 px-5 w-44">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="h-full rounded-full bg-[#F0B90B]"
                              style={{ width: `${Math.min(100, Math.max(1, pct))}%` }}
                            />
                          </div>
                          <span className="font-mono text-slate-400 text-[11px]">
                            {pct.toFixed(1)}%
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleTradeAsset(coin.symbol)}
                          className="rounded-xl bg-slate-800 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#F0B90B] hover:text-black transition border border-slate-700 hover:border-[#F0B90B]"
                        >
                          {coin.symbol === "USDT" ? "Deposit" : "Trade"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* TRANSACTIONS & ORDER LEDGER */}
        <div className="space-y-6">
          <TransactionHistory />
          <OrderHistory />
        </div>
      </div>
    </div>
  );
}

export default Wallet;
