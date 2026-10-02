import { useState, useEffect } from "react";
import TradingChart from "../components/TradingChart";
import TradePanel from "../components/TradePanel";
import OrderBook from "../components/OrderBook";
import RecentTrades from "../components/RecentTrades";
import OrderHistory from "../components/OrderHistory";
import { useTrading } from "../context/TradingContext";
import { getMarketPrices } from "../Services/MarketApi";
import { Layers, Activity, BookOpen, Clock } from "lucide-react";

function Trade() {
  const { selectedSymbol, wallet } = useTrading();
  const [currentPrice, setCurrentPrice] = useState(88450);
  const [activeBottomTab, setActiveBottomTab] = useState("orders"); // "orders" | "assets"
  const [sideTab, setSideTab] = useState("trade"); // "trade" | "book"

  useEffect(() => {
    let mounted = true;
    const update = async () => {
      try {
        const data = await getMarketPrices();
        if (mounted && Array.isArray(data)) {
          const coin = data.find((c) => c.symbol === selectedSymbol);
          if (coin) setCurrentPrice(coin.price);
        }
      } catch {
        // ignore
      }
    };
    update();
    const timer = setInterval(update, 3000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [selectedSymbol]);

  const asset = selectedSymbol.replace("USDT", "");
  const assetBal = Number(wallet?.[asset] || 0);
  const usdtBal = Number(wallet?.USDT || 0);

  return (
    <div className="min-h-screen bg-[#07090e] p-3 sm:p-5 text-white">
      <div className="mx-auto max-w-[1750px] space-y-4">
        {/* TOP STATUS BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-[#0c101a] px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#0ecb81] animate-ping" />
            <h1 className="text-sm sm:text-base font-bold text-white tracking-wide">
              WiseTrade Pro Terminal
            </h1>
            <span className="rounded-md bg-[#F0B90B]/15 px-2 py-0.5 text-xs font-bold text-[#F0B90B] border border-[#F0B90B]/30">
              High-Speed Engine
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs text-slate-400">
            <div>
              <span>Available USDT: </span>
              <span className="font-mono font-bold text-[#F0B90B]">
                ${usdtBal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span>{asset} Holding: </span>
              <span className="font-mono font-bold text-white">
                {assetBal.toFixed(asset === "BTC" || asset === "ETH" ? 6 : 4)} {asset}
              </span>
            </div>
          </div>
        </div>

        {/* MAIN TERMINAL GRID */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          {/* LEFT AREA: CHART + BOTTOM TABS (8 COLS) */}
          <div className="xl:col-span-8 space-y-4">
            <TradingChart />

            {/* BOTTOM TERMINAL TABS */}
            <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800/70 pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveBottomTab("orders")}
                    className={`flex items-center gap-1.5 text-xs font-bold transition pb-1 border-b-2 ${
                      activeBottomTab === "orders"
                        ? "border-[#F0B90B] text-[#F0B90B]"
                        : "border-transparent text-slate-400 hover:text-white"
                    }`}
                  >
                    <Clock size={14} />
                    <span>My Order History</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveBottomTab("assets")}
                    className={`flex items-center gap-1.5 text-xs font-bold transition pb-1 border-b-2 ${
                      activeBottomTab === "assets"
                        ? "border-[#F0B90B] text-[#F0B90B]"
                        : "border-transparent text-slate-400 hover:text-white"
                    }`}
                  >
                    <Layers size={14} />
                    <span>Wallet Allocation</span>
                  </button>
                </div>
              </div>

              {activeBottomTab === "orders" ? (
                <OrderHistory limit={6} />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                  {["BTC", "ETH", "SOL", "BNB"].map((c) => (
                    <div key={c} className="rounded-xl bg-[#121724] p-3 border border-slate-800">
                      <p className="text-xs text-slate-400">{c} Balance</p>
                      <p className="text-base font-bold text-white mt-1">
                        {Number(wallet?.[c] || 0).toFixed(4)} {c}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT AREA: TRADE PANEL + ORDERBOOK & TRADES (4 COLS) */}
          <div className="xl:col-span-4 space-y-4">
            {/* Quick Toggle for Mobile / Tablet */}
            <div className="flex xl:hidden rounded-xl bg-[#0c101a] p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setSideTab("trade")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  sideTab === "trade" ? "bg-[#F0B90B] text-black" : "text-slate-400"
                }`}
              >
                Place Order
              </button>
              <button
                type="button"
                onClick={() => setSideTab("book")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  sideTab === "book" ? "bg-[#F0B90B] text-black" : "text-slate-400"
                }`}
              >
                Order Book & Trades
              </button>
            </div>

            {/* Desktop: Show both or responsive */}
            <div className={`space-y-4 ${sideTab === "book" ? "hidden xl:block" : "block"}`}>
              <TradePanel />
            </div>

            <div className={`space-y-4 ${sideTab === "trade" ? "hidden xl:block" : "block"}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
                <OrderBook currentPrice={currentPrice} />
                <RecentTrades currentPrice={currentPrice} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trade;
