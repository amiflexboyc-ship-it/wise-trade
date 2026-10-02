import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrading } from "../context/TradingContext";
import { getMarketPrices } from "../Services/MarketApi";
import { ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";

const Markets = () => {
  const navigate = useNavigate();
  const { setSelectedSymbol } = useTrading();
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await getMarketPrices();
        if (mounted) setCoins(data.slice(0, 6));
      } catch {
        // ignore
      }
    };
    load();
    const timer = setInterval(load, 3500);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const handleTrade = (sym) => {
    setSelectedSymbol(sym);
    navigate("/trade");
  };

  return (
    <section id="markets" className="bg-[#090d16] text-white py-20 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F0B90B]">
            Real-Time Spot Quotes
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
            Explore Popular <span className="text-[#F0B90B]">Crypto Markets</span>
          </h2>
          <p className="text-slate-400 mt-2 text-sm max-w-xl mx-auto">
            Trade top digital assets with tight spreads, high liquidity, and instant simulated order routing.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {coins.map((coin) => (
            <div
              key={coin.symbol}
              onClick={() => handleTrade(coin.symbol)}
              className="group cursor-pointer rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 hover:border-[#F0B90B]/60 hover:bg-[#121724] transition-all duration-300 shadow-xl"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-800 group-hover:bg-[#F0B90B] group-hover:text-black text-[#F0B90B] flex items-center justify-center font-black text-xs transition duration-300 border border-slate-700">
                    {coin.base.slice(0, 3)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#F0B90B] transition">
                      {coin.base}/USDT
                    </h3>
                    <p className="text-xs text-slate-500">{coin.name}</p>
                  </div>
                </div>

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
              </div>

              <div className="mt-6 flex items-baseline justify-between">
                <div>
                  <p className="text-2xl font-black text-white tabular-nums font-mono">
                    ${coin.price.toLocaleString(undefined, { minimumFractionDigits: coin.price > 10 ? 2 : 4 })}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">24h Vol: ${coin.quoteVolume24h}</p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTrade(coin.symbol);
                  }}
                  className="rounded-xl bg-[#F0B90B] px-4 py-2 text-xs font-black text-black group-hover:bg-[#fcd535] transition shadow-md shadow-[#F0B90B]/15"
                >
                  Trade
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Markets;