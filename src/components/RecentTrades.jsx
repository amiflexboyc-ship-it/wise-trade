import { useEffect, useState } from "react";
import { generateRecentTrades } from "../Services/MarketApi";

function RecentTrades({ currentPrice = 88450 }) {
  const [trades, setTrades] = useState(() => generateRecentTrades(currentPrice));

  useEffect(() => {
    const timer = setInterval(() => {
      setTrades((prev) => {
        const side = Math.random() > 0.48 ? "BUY" : "SELL";
        const delta = (Math.random() - 0.5) * (currentPrice * 0.0004);
        const p = +(currentPrice + delta).toFixed(currentPrice > 10 ? 2 : 4);
        const size = +(Math.random() * (currentPrice > 1000 ? 0.6 : 12) + 0.01).toFixed(4);
        const now = new Date();

        const newTrade = {
          id: `tr-${Date.now()}-${Math.random()}`,
          price: p,
          size,
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          side,
        };

        return [newTrade, ...prev.slice(0, 9)];
      });
    }, 1600);

    return () => clearInterval(timer);
  }, [currentPrice]);

  return (
    <div className="w-full rounded-2xl border border-slate-800/80 bg-[#0c101a] p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800/70 pb-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
          Market Trades
        </h3>
        <span className="text-[11px] text-[#0ecb81] font-semibold flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0ecb81] animate-ping" />
          Realtime
        </span>
      </div>

      <div className="grid grid-cols-3 text-[10px] uppercase font-bold text-slate-500 mb-1 px-1">
        <span>Price (USDT)</span>
        <span className="text-right">Size</span>
        <span className="text-right">Time</span>
      </div>

      <div className="space-y-1">
        {trades.map((tr) => (
          <div
            key={tr.id}
            className="grid grid-cols-3 text-xs py-0.5 px-1 font-mono hover:bg-slate-800/40 rounded transition"
          >
            <span
              className={`font-bold tabular-nums ${
                tr.side === "BUY" ? "text-[#0ecb81]" : "text-[#f6465d]"
              }`}
            >
              {tr.price.toLocaleString(undefined, { minimumFractionDigits: tr.price > 10 ? 2 : 4 })}
            </span>
            <span className="text-right text-slate-300 tabular-nums">
              {tr.size}
            </span>
            <span className="text-right text-slate-500 text-[11px] tabular-nums">
              {tr.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentTrades;
