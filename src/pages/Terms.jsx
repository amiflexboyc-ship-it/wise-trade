import { Link } from "react-router-dom";
import { ShieldCheck, FileText, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Terms() {
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
          <span className="text-xs text-slate-500 font-mono">Last Updated: October 2026</span>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0B90B]/10 border border-[#F0B90B]/20 text-[#F0B90B] text-xs font-bold">
            <FileText size={14} />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Please read these Terms of Service carefully before creating an account or using the WiseTrade platform, trading terminal, or API endpoints.
          </p>
        </div>

        {/* Section 1: Introduction & Acceptance */}
        <section className="rounded-2xl border border-slate-800 bg-[#0c101a] p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#F0B90B] text-black font-black text-xs">
              1
            </span>
            Acceptance of Terms
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            By accessing, browsing, registering for, or using WiseTrade (“WiseTrade”, “Platform”, “we”, “our”, or “us”), you agree to be bound by these Terms of Service and all applicable guidelines, rules, and privacy policies. If you do not agree to these terms, you must discontinue platform use immediately.
          </p>
        </section>

        {/* Section 2: Paper-Trading & Simulation Disclaimer */}
        <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
            <AlertCircle size={20} className="text-amber-400" />
            2. Simulated Nature of Paper-Trading Capital
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            WiseTrade provides simulated cryptocurrency paper trading for educational and analytical purposes. 
            All portfolio balances (including but not limited to USDT, BTC, ETH, SOL, and BNB), simulated deposits, withdrawals, order blotters, and realized gains/losses are strictly virtual and have zero real fiat or financial value.
          </p>
          <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
            <li>Simulated balances cannot be redeemed for fiat currency, real cryptocurrency, or physical assets.</li>
            <li>Simulated withdrawals are recorded for ledger realism and do not transfer real on-chain cryptocurrency tokens.</li>
            <li>Past performance in simulated environments does not guarantee future results in live speculative markets.</li>
          </ul>
        </section>

        {/* Section 3: User Accounts & Security */}
        <section className="rounded-2xl border border-slate-800 bg-[#0c101a] p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#F0B90B] text-black font-black text-xs">
              3
            </span>
            Account Registration & Security Obligations
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            When creating an account, you agree to supply authentic, verifiable email information. You are solely responsible for maintaining the confidentiality of your credentials and all activities occurring under your account. WiseTrade enforces 256-bit encrypted authentication sessions.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 text-xs">
              <strong className="text-white block mb-1">Email Verification</strong>
              <span>Users are required to verify their email address via the automated authentication dispatcher to ensure account recovery.</span>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 text-xs">
              <strong className="text-white block mb-1">Credential Protection</strong>
              <span>Do not share your password. WiseTrade staff will never request your secret password or 2FA credentials.</span>
            </div>
          </div>
        </section>

        {/* Section 4: Prohibited Activities */}
        <section className="rounded-2xl border border-slate-800 bg-[#0c101a] p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#F0B90B] text-black font-black text-xs">
              4
            </span>
            Prohibited Activities
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Users may not engage in any of the following activities on WiseTrade:
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              <span>Attempting to circumvent server-side calculations, database validations, or API rate limiters.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              <span>Deploying unauthorized scraping bots that interfere with platform availability or market feeds.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              <span>Falsifying identity, claiming unauthorized administrative privileges, or spoofing customer support.</span>
            </li>
          </ul>
        </section>

        {/* Section 5: Limitation of Liability */}
        <section className="rounded-2xl border border-slate-800 bg-[#0c101a] p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#F0B90B] text-black font-black text-xs">
              5
            </span>
            Disclaimer of Warranties & Limitation of Liability
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            WiseTrade is provided on an “as is” and “as available” basis without express or implied warranties of any kind. Under no circumstances shall WiseTrade, its creators, or partners be liable for any direct, indirect, incidental, or consequential damages resulting from your use of the platform, third-party market data delays, or downtime.
          </p>
        </section>

        {/* Footer info */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 WiseTrade Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-[#F0B90B] transition">Privacy Policy</Link>
            <Link to="/risk-disclaimer" className="hover:text-[#F0B90B] transition">Risk Disclaimer</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
