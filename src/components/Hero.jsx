import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTrading } from "../context/TradingContext";
import { getMarketPrices } from "../Services/MarketApi";
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Lock,
  Globe2,
} from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  const { loginAsDemo } = useTrading();
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchLive = async () => {
      try {
        const data = await getMarketPrices();
        if (mounted) setMarkets(data || []);
      } catch {
        // ignore
      }
    };
    fetchLive();
    const timer = setInterval(fetchLive, 3500);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const handleStartDemo = () => {
    loginAsDemo();
    navigate("/dashboard");
  };

  const previewCoins = markets.slice(0, 4);

  return (
    <section
      id="home"
      className="relative min-h-[92vh] pt-24 pb-16 bg-[#07090e] text-white flex items-center overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#F0B90B]/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-[#0ecb81]/10 blur-[140px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* LEFT COLUMN: HERO VALUE PROP */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F0B90B]/30 bg-[#F0B90B]/10 px-4 py-1.5 text-xs font-black text-[#F0B90B]">
            <Sparkles size={14} />
            <span>Next-Generation Paper Trading & Spot Terminal</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
            Trade Smarter.
            <br />
            <span className="bg-gradient-to-r from-[#F0B90B] via-[#fcd535] to-[#0ecb81] bg-clip-text text-transparent">
              Master the Markets.
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
            WiseTrade provides live institutional-grade cryptocurrency market data, high-frequency execution simulation, and an initial $10,000 sandbox portfolio with zero risk.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <Link
              to="/register"
              className="flex items-center gap-2 rounded-xl bg-[#F0B90B] px-7 py-4 text-sm font-black text-black hover:bg-[#fcd535] transition shadow-xl shadow-[#F0B90B]/25 hover:scale-[1.02]"
            >
              <Zap size={16} />
              <span>Create Free Account ($10K)</span>
            </Link>

            <Link
              to="/login"
              className="flex items-center gap-2 rounded-xl bg-[#121724] px-6 py-4 text-sm font-bold text-white hover:bg-slate-800 transition border border-slate-700/80"
            >
              <span>Sign In to Terminal</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0 text-left">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-[#F0B90B] tabular-nums">250K+</p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Active Traders</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white tabular-nums">$4.8B</p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">24h Simulated Vol</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-[#0ecb81] tabular-nums">&lt;0.5ms</p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Matching Latency</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE MARKET SHOWCASE CARD */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md rounded-3xl border border-slate-800/90 bg-gradient-to-b from-[#121724]/90 to-[#0c101a]/95 p-6 shadow-2xl backdrop-blur-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0ecb81] animate-ping" />
                <h3 className="font-bold text-sm text-white">Live Exchange Index</h3>
              </div>
              <span className="text-[11px] font-mono text-[#F0B90B] font-semibold">
                Binance Spot Feed
              </span>
            </div>

            {/* LIVE COIN ROWS */}
            <div className="space-y-2.5">
              {previewCoins.map((coin) => (
                <div
                  key={coin.symbol}
                  onClick={() => navigate("/trade")}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#080b12]/60 hover:bg-[#161d2e] border border-slate-800/60 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-xs font-black text-[#F0B90B]">
                      {coin.base.slice(0, 3)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">{coin.base}/USDT</p>
                      <p className="text-[10px] text-slate-400">{coin.name}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-mono font-bold text-sm text-white tabular-nums">
                      ${coin.price.toLocaleString(undefined, { minimumFractionDigits: coin.price > 10 ? 2 : 4 })}
                    </p>
                    <p
                      className={`text-[11px] font-semibold font-mono ${
                        coin.change24h >= 0 ? "text-[#0ecb81]" : "text-[#f6465d]"
                      }`}
                    >
                      {coin.change24h >= 0 ? "+" : ""}{coin.change24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Demo Preview Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartDemo}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F0B90B] to-[#fcd535] py-3 text-xs font-black text-black hover:opacity-95 transition shadow-lg shadow-[#F0B90B]/20"
              >
                <span>Launch Free Trading Workspace</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;