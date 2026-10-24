import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Eye, Server, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function Privacy() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <ShieldCheck size={14} />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your privacy and security are paramount at WiseTrade. This policy explains what information we collect, how it is secured, and your rights under global privacy frameworks.
          </p>
        </div>

        {/* Section 1: Information Collected */}
        <section className="rounded-2xl border border-slate-800 bg-[#0c101a] p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Eye size={18} className="text-[#F0B90B]" />
            1. Information We Collect
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            We collect minimal, necessary data required to operate your account and authenticate paper-trading sessions:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-1">
              <strong className="text-white text-xs block">Account Information</strong>
              <p className="text-[11px] text-slate-400">
                Email address, encrypted authentication tokens (via Firebase Auth), display name, and email verification status.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-1">
              <strong className="text-white text-xs block">Trading & Wallet Ledger</strong>
              <p className="text-[11px] text-slate-400">
                Simulated wallet balances, simulated order blotter history, and deposit/withdrawal records stored in Google Cloud Firestore.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: How We Protect Data */}
        <section className="rounded-2xl border border-slate-800 bg-[#0c101a] p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock size={18} className="text-[#0ecb81]" />
            2. Data Security & Storage Architecture
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            All user data is stored within certified infrastructure meeting SOC 2 Type II and ISO 27001 standards. 
            Passwords are salted and hashed on the server; WiseTrade never stores plain-text passwords.
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#0ecb81] shrink-0" />
              <span>TLS 1.3 / 256-bit AES encryption across all API requests and browser connections.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#0ecb81] shrink-0" />
              <span>Zero exposure of private server secrets to browser bundles.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#0ecb81] shrink-0" />
              <span>Separation of serverless backend computation from public client bundles.</span>
            </li>
          </ul>
        </section>

        {/* Section 3: Third Party Providers */}
        <section className="rounded-2xl border border-slate-800 bg-[#0c101a] p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Server size={18} className="text-cyan-400" />
            3. Third-Party Service Providers
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            We partner with trusted institutional cloud platforms to deliver our services:
          </p>
          <ul className="space-y-2 text-xs text-slate-400 list-disc list-inside">
            <li><strong className="text-slate-200">Google Firebase</strong>: User authentication, password reset pipelines, and Firestore database.</li>
            <li><strong className="text-slate-200">Vercel Inc.</strong>: Global edge deployment, SSL certificates, and serverless compute functions.</li>
            <li><strong className="text-slate-200">Binance Public Feeds</strong>: Real-time ticker and candlestick market data streaming.</li>
          </ul>
        </section>

        {/* Section 4: Your Rights */}
        <section className="rounded-2xl border border-slate-800 bg-[#0c101a] p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#F0B90B] text-black font-black text-xs">
              4
            </span>
            User Rights (GDPR & CCPA)
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            You maintain full rights to access, download, or delete your account records at any time. To request account deletion or data export, submit a ticket in the Support Center or reset your portfolio directly in the settings menu.
          </p>
        </section>

        {/* Footer info */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 WiseTrade Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-[#F0B90B] transition">Terms of Service</Link>
            <Link to="/risk-disclaimer" className="hover:text-[#F0B90B] transition">Risk Disclaimer</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
