import { Link } from "react-router-dom";
import { AlertTriangle, TrendingDown, ShieldAlert, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function RiskDisclaimer() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-300 px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#F0B90B] transition"
          >
            <ArrowLeft size={16} />
            <span>Return to WiseTrade</span>
          </Link>
          <span className="text-xs text-slate-500 font-mono">Regulatory Disclosure</span>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
            <AlertTriangle size={14} />
            <span>Important Risk Disclosure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Risk Disclosure & Financial Disclaimer
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Please read this notice thoroughly to understand the nature of digital asset market volatility and the simulation scope of WiseTrade.
          </p>
        </div>

        {/* Highlight Alert Box */}
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 sm:p-8 space-y-3">
          <h2 className="text-base font-bold text-red-400 flex items-center gap-2">
            <ShieldAlert size={20} className="text-red-400" />
            No Financial, Investment, or Trading Advice
          </h2>
          <p className="text-xs text-red-200/90 leading-relaxed">
            Nothing published on WiseTrade constitutes financial advice, investment recommendations, endorsement, or solicitation to buy, sell, or hold any cryptocurrency or financial instrument. 
            All content, technical indicators, AI support suggestions, and chart layouts are provided strictly for informational and educational simulation purposes.
          </p>
        </div>

        {/* Section 1: Simulated Environment */}
        <section className="rounded-2xl border border-slate-800 bg-[#0c101a] p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[#0ecb81]" />
            1. Simulation Scope & Zero Real Money Risk on WiseTrade
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            WiseTrade is engineered as a zero-risk simulated paper trading environment:
          </p>
          <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
            <li>You will never be asked to deposit real fiat currency or transfer real cryptocurrency to trade on this platform.</li>
            <li>All initial capital ($10,000 USDT sandbox balance) is strictly virtual.</li>
            <li>Simulated gains and losses do not reflect slippage, hidden exchange commissions, market order queuing, or liquidity gaps that may occur in live order books.</li>
          </ul>
        </section>

        {/* Section 2: Real Market Volatility */}
        <section className="rounded-2xl border border-slate-800 bg-[#0c101a] p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingDown size={18} className="text-[#F0B90B]" />
            2. Volatility of Live Cryptocurrency Markets
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Cryptocurrency markets are subject to extreme market volatility, regulatory uncertainty, and technology risks:
          </p>
          <div className="space-y-2 text-xs text-slate-400">
            <p>
              • <strong className="text-slate-200">High Volatility:</strong> Digital asset prices can swing drastically within seconds. Traders can lose substantial capital in live speculative environments.
            </p>
            <p>
              • <strong className="text-slate-200">Psychological Difference:</strong> Paper trading does not replicate the psychological stress or emotional pressures of trading with real financial exposure.
            </p>
            <p>
              • <strong className="text-slate-200">Independent Research:</strong> Always conduct your own research (DYOR) and consult a qualified, licensed financial advisor before allocating real capital.
            </p>
          </div>
        </section>

        {/* Footer info */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 WiseTrade Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-[#F0B90B] transition">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-[#F0B90B] transition">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
