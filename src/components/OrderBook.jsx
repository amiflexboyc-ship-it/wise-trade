import { useEffect, useState } from "react";
import { generateOrderBook } from "../Services/MarketApi";

function OrderBook({ currentPrice = 88450 }) {
  const [data, setData] = useState(() => generateOrderBook(currentPrice));

  useEffect(() => {
    const timer = setInterval(() => {
      setData(generateOrderBook(currentPrice));
    }, 1500);

    return () => clearInterval(timer);
  }, [currentPrice]);

  const maxTotal = Math.max(
    ...data.asks.map((a) => a.total),
    ...data.bids.map((b) => b.total),
    1
  );

  return (
    <div className="w-full rounded-2xl border border-slate-800/80 bg-[#0c101a] p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800/70 pb-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
          Order Book
        </h3>
        <span className="text-[11px] text-slate-500 font-mono">
          Spread: {data.spread}
        </span>
      </div>

      {/* COLUMN HEADERS */}
      <div className="grid grid-cols-3 text-[10px] uppercase font-bold text-slate-500 mb-1 px-1">
        <span>Price (USDT)</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* ASKS (SELL ORDERS - RED) */}
      <div className="space-y-0.5">
        {data.asks.slice(-6).map((ask, idx) => {
          const depthPercent = Math.min(100, (ask.total / maxTotal) * 100);
          return (
            <div
              key={`ask-${idx}`}
              className="relative grid grid-cols-3 text-xs py-0.5 px-1 font-mono hover:bg-slate-800/40 rounded transition"
            >
              <div
                className="absolute inset-y-0 right-0 bg-[#f6465d]/12 rounded-r pointer-events-none"
                style={{ width: `${depthPercent}%` }}
              />
              <span className="relative z-10 font-bold text-[#f6465d] tabular-nums">
                {ask.price.toLocaleString(undefined, { minimumFractionDigits: ask.price > 10 ? 2 : 4 })}
              </span>
              <span className="relative z-10 text-right text-slate-300 tabular-nums">
                {ask.amount}
              </span>
              <span className="relative z-10 text-right text-slate-400 tabular-nums">
                {ask.total}
              </span>
            </div>
          );
        })}
      </div>

      {/* CURRENT MID MARKET PRICE */}
      <div className="my-2.5 py-1.5 px-2 bg-[#080b12] rounded-lg border border-slate-800/60 flex items-center justify-between font-mono">
        <span className="text-sm font-black text-white tabular-nums">
          ${currentPrice ? currentPrice.toLocaleString(undefined, { minimumFractionDigits: currentPrice > 10 ? 2 : 4 }) : "--"}
        </span>
        <span className="text-[10px] text-[#0ecb81] font-bold">
          ▲ Market Index
        </span>
      </div>

      {/* BIDS (BUY ORDERS - GREEN) */}
      <div className="space-y-0.5">
        {data.bids.slice(0, 6).map((bid, idx) => {
          const depthPercent = Math.min(100, (bid.total / maxTotal) * 100);
          return (
            <div
              key={`bid-${idx}`}
              className="relative grid grid-cols-3 text-xs py-0.5 px-1 font-mono hover:bg-slate-800/40 rounded transition"
            >
              <div
                className="absolute inset-y-0 right-0 bg-[#0ecb81]/12 rounded-r pointer-events-none"
                style={{ width: `${depthPercent}%` }}
              />
              <span className="relative z-10 font-bold text-[#0ecb81] tabular-nums">
                {bid.price.toLocaleString(undefined, { minimumFractionDigits: bid.price > 10 ? 2 : 4 })}
              </span>
              <span className="relative z-10 text-right text-slate-300 tabular-nums">
                {bid.amount}
              </span>
              <span className="relative z-10 text-right text-slate-400 tabular-nums">
                {bid.total}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderBook;
