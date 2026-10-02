import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTrading } from "../context/TradingContext";
import { getMarketPrices } from "../Services/MarketApi";
import { Search, TrendingUp, Flame, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";

function Market() {
  const navigate = useNavigate();
  const { setSelectedSymbol } = useTrading();

  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => {
    let mounted = true;
    const fetchMarkets = async () => {
      try {
        const data = await getMarketPrices();
        if (mounted) {
          setMarkets(data || []);
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    };

    fetchMarkets();
    const timer = setInterval(fetchMarkets, 3500);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const handleTrade = (symbol) => {
    setSelectedSymbol(symbol);
    navigate("/trade");
  };

  const filteredMarkets = useMemo(() => {
    return markets.filter((coin) => {
      const matchSearch =
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.base.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      if (activeCategory === "ALL") return true;
      if (activeCategory === "GAINERS") return coin.change24h > 0;
      if (activeCategory === "LOSERS") return coin.change24h < 0;
      if (activeCategory === "MEME") return coin.category === "Meme";
      if (activeCategory === "L1") return coin.category === "Layer 1";
      return true;
    });
  }, [markets, searchTerm, activeCategory]);

  const topGainer = useMemo(() => {
    if (!markets.length) return null;
    return [...markets].sort((a, b) => b.change24h - a.change24h)[0];
  }, [markets]);

  const topVolume = useMemo(() => {
    if (!markets.length) return null;
    return markets[0];
  }, [markets]);

  return (
    <div className="min-h-screen bg-[#07090e] p-4 sm:p-6 lg:p-8 text-white">
      <div className="mx-auto max-w-[1700px] space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0ecb81] animate-ping" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#F0B90B]">
                Global Crypto Markets
              </span>
            </div>
            <h1 className="mt-1 text-3xl font-black text-white tracking-tight">
              Market Intelligence
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Live spot prices, 24-hour liquidity volume, and algorithmic indicators
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="rounded-full bg-slate-800 px-3 py-1.5 border border-slate-700">
              ⚡ Updated every 3.5s
            </span>
          </div>
        </div>

        {/* HIGHLIGHT TILES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Top Gainer */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Flame size={14} className="text-[#0ecb81]" />
                <span>24h Top Gainer</span>
              </div>
              <p className="mt-1 text-lg font-black text-white">
                {topGainer ? `${topGainer.base}/USDT` : "--"}
              </p>
              <p className="text-xs font-mono font-bold text-[#0ecb81]">
                {topGainer ? `+${topGainer.change24h.toFixed(2)}%` : "--"}
              </p>
            </div>
            <button
              onClick={() => topGainer && handleTrade(topGainer.symbol)}
              className="rounded-xl bg-[#0ecb81]/15 px-3 py-2 text-xs font-bold text-[#0ecb81] hover:bg-[#0ecb81]/25 border border-[#0ecb81]/30"
            >
              Trade
            </button>
          </div>

          {/* Highest Volume */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <TrendingUp size={14} className="text-[#F0B90B]" />
                <span>Highest Volume</span>
              </div>
              <p className="mt-1 text-lg font-black text-white">
                {topVolume ? `${topVolume.base}/USDT` : "--"}
              </p>
              <p className="text-xs font-mono text-slate-300">
                ${topVolume ? topVolume.quoteVolume24h : "--"} USDT
              </p>
            </div>
            <button
              onClick={() => topVolume && handleTrade(topVolume.symbol)}
              className="rounded-xl bg-[#F0B90B]/15 px-3 py-2 text-xs font-bold text-[#F0B90B] hover:bg-[#F0B90B]/25 border border-[#F0B90B]/30"
            >
              Trade
            </button>
          </div>

          {/* New Listings / Trending */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Zap size={14} className="text-sky-400" />
                <span>Trending Asset</span>
              </div>
              <p className="mt-1 text-lg font-black text-white">SOL/USDT</p>
              <p className="text-xs font-mono text-[#0ecb81]">+5.68%</p>
            </div>
            <button
              onClick={() => handleTrade("SOLUSDT")}
              className="rounded-xl bg-sky-500/15 px-3 py-2 text-xs font-bold text-sky-400 hover:bg-sky-500/25 border border-sky-500/30"
            >
              Trade
            </button>
          </div>
        </div>

        {/* CONTROLS: CATEGORIES & SEARCH */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "ALL", label: "All Markets" },
              { id: "L1", label: "Layer 1" },
              { id: "GAINERS", label: "Top Gainers" },
              { id: "LOSERS", label: "Top Losers" },
              { id: "MEME", label: "Meme" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  activeCategory === cat.id
                    ? "bg-[#F0B90B] text-black shadow-lg shadow-[#F0B90B]/20"
                    : "bg-[#121724] text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search coin or pair..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-[#121724] py-2 pl-9 pr-4 text-xs font-medium text-white outline-none focus:border-[#F0B90B] transition"
            />
          </div>
        </div>

        {/* FULL MARKET DATA TABLE */}
        <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0c101a] shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-xs">
              <thead className="border-b border-slate-800/80 bg-[#090d16] text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-4 px-5">Pair</th>
                  <th className="py-4 px-5">Last Price</th>
                  <th className="py-4 px-5">24h Change</th>
                  <th className="py-4 px-5">24h High</th>
                  <th className="py-4 px-5">24h Low</th>
                  <th className="py-4 px-5">24h Volume (USDT)</th>
                  <th className="py-4 px-5 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/40">
                {filteredMarkets.map((coin) => (
                  <tr
                    key={coin.symbol}
                    onClick={() => handleTrade(coin.symbol)}
                    className="hover:bg-slate-800/40 cursor-pointer transition"
                  >
                    {/* Pair & Name */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 font-black text-[#F0B90B] text-xs border border-slate-700">
                          {coin.base.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-sm">{coin.base}</span>
                            <span className="text-slate-400 font-medium">/USDT</span>
                          </div>
                          <span className="text-[11px] text-slate-500">{coin.name}</span>
                        </div>
                      </div>
                    </td>

                    {/* Last Price */}
                    <td className="py-4 px-5 font-mono font-bold text-sm text-white tabular-nums">
                      ${coin.price.toLocaleString(undefined, { minimumFractionDigits: coin.price > 10 ? 2 : 4 })}
                    </td>

                    {/* 24h Change */}
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold font-mono ${
                          coin.change24h >= 0
                            ? "bg-[#0ecb81]/15 text-[#0ecb81] border border-[#0ecb81]/30"
                            : "bg-[#f6465d]/15 text-[#f6465d] border border-[#f6465d]/30"
                        }`}
                      >
                        {coin.change24h >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                        {coin.change24h >= 0 ? "+" : ""}{coin.change24h.toFixed(2)}%
                      </span>
                    </td>

                    {/* 24h High */}
                    <td className="py-4 px-5 font-mono text-slate-300 tabular-nums">
                      ${coin.high24h.toLocaleString(undefined, { minimumFractionDigits: coin.high24h > 10 ? 2 : 4 })}
                    </td>

                    {/* 24h Low */}
                    <td className="py-4 px-5 font-mono text-slate-400 tabular-nums">
                      ${coin.low24h.toLocaleString(undefined, { minimumFractionDigits: coin.low24h > 10 ? 2 : 4 })}
                    </td>

                    {/* 24h Volume */}
                    <td className="py-4 px-5 font-mono text-slate-300 tabular-nums">
                      ${coin.quoteVolume24h}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTrade(coin.symbol);
                        }}
                        className="rounded-xl bg-[#F0B90B] px-4 py-1.5 text-xs font-black text-black hover:bg-[#fcd535] transition shadow-md shadow-[#F0B90B]/15"
                      >
                        Trade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Market;
