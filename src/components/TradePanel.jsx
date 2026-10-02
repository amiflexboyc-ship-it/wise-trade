import { useEffect, useState, useMemo } from "react";
import { useTrading } from "../context/TradingContext";
import { getMarketPrices } from "../Services/MarketApi";
import { ArrowDownUp, CheckCircle, ShieldAlert, Zap } from "lucide-react";

function TradePanel() {
  const {
    wallet,
    buyAsset,
    sellAsset,
    selectedSymbol,
    setSelectedSymbol,
    notify,
  } = useTrading();

  const [orderType, setOrderType] = useState("MARKET"); // "MARKET" | "LIMIT"
  const [side, setSide] = useState("BUY"); // "BUY" | "SELL"
  const [amount, setAmount] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [percent, setPercent] = useState(0);
  const [trading, setTrading] = useState(false);
  const [enableTPSL, setEnableTPSL] = useState(false);
  const [tpPrice, setTpPrice] = useState("");
  const [slPrice, setSlPrice] = useState("");

  const [markets, setMarkets] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);

  const supportedAssets = [
    { symbol: "BTCUSDT", short: "BTC", name: "Bitcoin" },
    { symbol: "ETHUSDT", short: "ETH", name: "Ethereum" },
    { symbol: "SOLUSDT", short: "SOL", name: "Solana" },
    { symbol: "BNBUSDT", short: "BNB", name: "BNB" },
    { symbol: "XRPUSDT", short: "XRP", name: "Ripple" },
    { symbol: "ADAUSDT", short: "ADA", name: "Cardano" },
    { symbol: "DOGEUSDT", short: "DOGE", name: "Dogecoin" },
    { symbol: "AVAXUSDT", short: "AVAX", name: "Avalanche" },
  ];

  const currentCoin =
    supportedAssets.find((a) => a.symbol === selectedSymbol) || supportedAssets[0];
  const asset = currentCoin.short;

  // Poll prices
  useEffect(() => {
    let mounted = true;
    const fetchPrices = async () => {
      try {
        const data = await getMarketPrices();
        if (mounted && Array.isArray(data)) {
          setMarkets(data);
          const found = data.find((c) => c.symbol === selectedSymbol);
          if (found) {
            setCurrentPrice(found.price);
            if (!limitPrice) {
              setLimitPrice(found.price.toString());
            }
          }
        }
      } catch (err) {
        console.warn("TradePanel market fetch error:", err);
      }
    };

    fetchPrices();
    const timer = setInterval(fetchPrices, 3000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [selectedSymbol]);

  const usdtBalance = Number(wallet?.USDT || 0);
  const assetBalance = Number(wallet?.[asset] || 0);

  const executionPrice =
    orderType === "LIMIT" ? Number(limitPrice) || currentPrice : currentPrice;

  const numAmount = Number(amount) || 0;
  const subtotal = numAmount * executionPrice;
  const estimatedFee = +(subtotal * 0.001).toFixed(2);
  const total = side === "BUY" ? subtotal + estimatedFee : subtotal - estimatedFee;

  // Handle quick percentage selection
  const handlePercentSelect = (pct) => {
    setPercent(pct);
    if (side === "BUY") {
      if (executionPrice <= 0) return;
      const budget = (usdtBalance * pct) / 100;
      // account for 0.1% fee
      const qty = (budget / (executionPrice * 1.001)).toFixed(asset === "BTC" || asset === "ETH" ? 6 : 4);
      setAmount(qty > 0 ? qty : "");
    } else {
      const qty = ((assetBalance * pct) / 100).toFixed(asset === "BTC" || asset === "ETH" ? 6 : 4);
      setAmount(qty > 0 ? qty : "");
    }
  };

  const handleTrade = async () => {
    if (trading || numAmount <= 0 || executionPrice <= 0) return;

    if (side === "BUY" && total > usdtBalance) {
      notify("Insufficient available USDT balance.", "error", "Trade Error");
      return;
    }

    if (side === "SELL" && numAmount > assetBalance) {
      notify(`Insufficient ${asset} balance.`, "error", "Trade Error");
      return;
    }

    try {
      setTrading(true);
      let res;
      if (side === "BUY") {
        res = await buyAsset(selectedSymbol, numAmount, executionPrice);
      } else {
        res = await sellAsset(selectedSymbol, numAmount, executionPrice);
      }

      if (res?.success) {
        setAmount("");
        setPercent(0);
      }
    } finally {
      setTrading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-800/80 bg-[#0c101a] p-4 sm:p-5 shadow-xl">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#0ecb81] animate-pulse" />
          <h3 className="font-bold text-white tracking-wide">Spot Order</h3>
        </div>
        <span className="rounded-full bg-[#F0B90B]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#F0B90B] border border-[#F0B90B]/25">
          0.1% Fee • VIP 1
        </span>
      </div>

      {/* PAIR SELECTOR DROPDOWN */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
          Trading Pair
        </label>
        <div className="relative">
          <select
            value={selectedSymbol}
            onChange={(e) => {
              setSelectedSymbol(e.target.value);
              setAmount("");
              setPercent(0);
            }}
            className="w-full appearance-none rounded-xl border border-slate-800 bg-[#121724] px-3.5 py-2.5 text-sm font-bold text-white outline-none focus:border-[#F0B90B] transition cursor-pointer"
          >
            {supportedAssets.map((item) => (
              <option key={item.symbol} value={item.symbol} className="bg-slate-900 text-white">
                {item.short}/USDT — {item.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <ArrowDownUp size={14} />
          </div>
        </div>
      </div>

      {/* BUY / SELL TOGGLE */}
      <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-[#080b12] p-1 mb-4">
        <button
          type="button"
          onClick={() => {
            setSide("BUY");
            setPercent(0);
          }}
          className={`rounded-lg py-2.5 text-xs font-black transition tracking-wider ${
            side === "BUY"
              ? "bg-[#0ecb81] text-black shadow-lg shadow-[#0ecb81]/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          BUY {asset}
        </button>

        <button
          type="button"
          onClick={() => {
            setSide("SELL");
            setPercent(0);
          }}
          className={`rounded-lg py-2.5 text-xs font-black transition tracking-wider ${
            side === "SELL"
              ? "bg-[#f6465d] text-white shadow-lg shadow-[#f6465d]/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          SELL {asset}
        </button>
      </div>

      {/* ORDER TYPE TABS (MARKET / LIMIT) */}
      <div className="flex gap-2 mb-4 border-b border-slate-800/80 pb-3">
        <button
          type="button"
          onClick={() => setOrderType("MARKET")}
          className={`text-xs font-bold transition pb-1 border-b-2 ${
            orderType === "MARKET"
              ? "border-[#F0B90B] text-[#F0B90B]"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Market Order
        </button>

        <button
          type="button"
          onClick={() => setOrderType("LIMIT")}
          className={`text-xs font-bold transition pb-1 border-b-2 ${
            orderType === "LIMIT"
              ? "border-[#F0B90B] text-[#F0B90B]"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Limit Order
        </button>
      </div>

      {/* PRICE INPUT (Editable if LIMIT, fixed if MARKET) */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Order Price</span>
          <span className="font-mono text-slate-300">
            Live: ${currentPrice ? currentPrice.toLocaleString() : "--"}
          </span>
        </div>

        <div className="relative">
          <input
            type="number"
            step="any"
            disabled={orderType === "MARKET"}
            value={orderType === "MARKET" ? currentPrice || "" : limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-[#121724] px-3.5 py-2.5 text-sm font-mono text-white outline-none focus:border-[#F0B90B] disabled:opacity-75 disabled:cursor-not-allowed transition"
            placeholder={orderType === "MARKET" ? "Best Market Price" : "Enter Limit Price"}
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
            USDT
          </span>
        </div>
      </div>

      {/* AMOUNT INPUT */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Amount</span>
          <span className="text-slate-400">
            Available:{" "}
            <span className="font-semibold text-white font-mono">
              {side === "BUY"
                ? `$${usdtBalance.toFixed(2)}`
                : `${assetBalance.toFixed(6)} ${asset}`}
            </span>
          </span>
        </div>

        <div className="relative">
          <input
            type="number"
            step="any"
            min="0"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setPercent(0);
            }}
            placeholder={`0.00`}
            className="w-full rounded-xl border border-slate-800 bg-[#121724] px-3.5 py-2.5 text-sm font-mono text-white outline-none focus:border-[#F0B90B] transition"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#F0B90B]">
            {asset}
          </span>
        </div>
      </div>

      {/* QUICK PERCENTAGE BUTTONS */}
      <div className="grid grid-cols-4 gap-1.5 mb-4">
        {[25, 50, 75, 100].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => handlePercentSelect(p)}
            className={`rounded-lg py-1.5 text-xs font-bold font-mono transition ${
              percent === p
                ? "bg-[#F0B90B] text-black"
                : "bg-[#121724] text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800/80"
            }`}
          >
            {p}%
          </button>
        ))}
      </div>

      {/* TP / SL TOGGLE */}
      <div className="mb-4 border-t border-slate-800/60 pt-3">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-400">
            <input
              type="checkbox"
              checked={enableTPSL}
              onChange={(e) => setEnableTPSL(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-[#F0B90B] focus:ring-0 cursor-pointer"
            />
            <span>Take Profit / Stop Loss (TP/SL)</span>
          </label>
        </div>

        {enableTPSL && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <input
              type="number"
              placeholder="TP Price"
              value={tpPrice}
              onChange={(e) => setTpPrice(e.target.value)}
              className="rounded-lg border border-slate-800 bg-[#121724] px-3 py-1.5 text-xs font-mono text-white outline-none focus:border-[#0ecb81]"
            />
            <input
              type="number"
              placeholder="SL Price"
              value={slPrice}
              onChange={(e) => setSlPrice(e.target.value)}
              className="rounded-lg border border-slate-800 bg-[#121724] px-3 py-1.5 text-xs font-mono text-white outline-none focus:border-[#f6465d]"
            />
          </div>
        )}
      </div>

      {/* SUMMARY BREAKDOWN */}
      <div className="rounded-xl bg-[#080b12] p-3 space-y-1.5 text-xs mb-4 border border-slate-800/50">
        <div className="flex justify-between text-slate-400">
          <span>Subtotal</span>
          <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Est. Fee (0.1%)</span>
          <span className="font-mono text-slate-300">${estimatedFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-800/70 pt-1.5 font-bold">
          <span className="text-white">Order Total</span>
          <span className="font-mono text-[#F0B90B] text-sm">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="button"
        disabled={trading || numAmount <= 0 || executionPrice <= 0}
        onClick={handleTrade}
        className={`w-full rounded-xl py-3.5 text-sm font-black transition tracking-wider disabled:opacity-40 disabled:cursor-not-allowed shadow-xl ${
          side === "BUY"
            ? "bg-[#0ecb81] text-black hover:bg-[#0bb371] shadow-[#0ecb81]/25"
            : "bg-[#f6465d] text-white hover:bg-[#e0374e] shadow-[#f6465d]/25"
        }`}
      >
        {trading ? (
          "Executing Order..."
        ) : (
          <div className="flex items-center justify-center gap-1.5">
            <Zap size={16} />
            <span>
              {side === "BUY" ? `BUY ${asset}` : `SELL ${asset}`}
            </span>
          </div>
        )}
      </button>

      {/* SAFE DISCLOSURE */}
      <p className="mt-3 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
        <ShieldAlert size={12} />
        <span>WiseTrade High-Frequency Simulated Matching Engine</span>
      </p>
    </div>
  );
}

export default TradePanel;
