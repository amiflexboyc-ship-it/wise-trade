import { useState } from "react";
import { useTrading } from "../context/TradingContext";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Key,
  Smartphone,
  Lock,
  RotateCcw,
  LogOut,
  CheckCircle,
  Copy,
  ExternalLink,
} from "lucide-react";

function Profile() {
  const { user, wallet, logout, resetDemoAccount, notify } = useTrading();
  const navigate = useNavigate();

  const [tfaEnabled, setTfaEnabled] = useState(true);
  const [antiPhishing, setAntiPhishing] = useState("WISE-SAFE-99");
  const [copiedUid, setCopiedUid] = useState(false);

  const uid = user?.uid || "wt_user_99214";

  const handleCopyUid = () => {
    navigator.clipboard?.writeText(uid);
    setCopiedUid(true);
    notify("User ID copied to clipboard!", "success");
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#07090e] p-4 sm:p-6 lg:p-8 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#0ecb81]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#F0B90B]">
                Account & Security
              </span>
            </div>
            <h1 className="mt-1 text-3xl font-black text-white tracking-tight">
              Trader Profile & Security Center
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage account authentication, KYC verification, and trading configurations
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl bg-red-500/15 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/25 border border-red-500/30 transition self-start sm:self-auto"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* TOP PROFILE CARD */}
        <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#F0B90B] to-[#fcd535] text-2xl font-black text-black shadow-lg shadow-[#F0B90B]/20">
                {(user?.displayName || user?.email || "T").charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">
                    {user?.displayName || "Pro Trader"}
                  </h2>
                  <span className="rounded-full bg-[#0ecb81]/15 px-2.5 py-0.5 text-xs font-bold text-[#0ecb81] border border-[#0ecb81]/30">
                    KYC Verified Level 2
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">{user?.email || "trader.demo@wisetrade.io"}</p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-slate-500 font-mono">UID: {uid}</span>
                  <button
                    type="button"
                    onClick={handleCopyUid}
                    className="text-slate-400 hover:text-white"
                  >
                    <Copy size={12} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-xl bg-[#F0B90B]/15 px-4 py-2 text-xs font-bold text-[#F0B90B] border border-[#F0B90B]/30">
                VIP Tier: Level 1 (0.1% Taker)
              </span>
            </div>
          </div>
        </div>

        {/* SECURITY SETTINGS & CREDENTIALS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Security Center */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Lock size={18} className="text-[#F0B90B]" />
              <h3 className="font-bold text-base text-white">Security Safeguards</h3>
            </div>

            {/* 2FA Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-white">Two-Factor Authentication (2FA)</p>
                <p className="text-xs text-slate-400">Google Authenticator or YubiKey OTP</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTfaEnabled(!tfaEnabled);
                  notify(`2FA ${!tfaEnabled ? "Enabled" : "Disabled"}`, "info");
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  tfaEnabled ? "bg-[#0ecb81]" : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    tfaEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Anti-Phishing */}
            <div className="flex items-center justify-between border-t border-slate-800/60 pt-4">
              <div>
                <p className="font-semibold text-sm text-white">Anti-Phishing Verification Code</p>
                <p className="text-xs text-slate-400">Included in all official WiseTrade notifications</p>
              </div>
              <span className="font-mono text-xs bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-[#F0B90B]">
                {antiPhishing}
              </span>
            </div>

            {/* KYC Level */}
            <div className="flex items-center justify-between border-t border-slate-800/60 pt-4">
              <div>
                <p className="font-semibold text-sm text-white">Identity Verification (KYC)</p>
                <p className="text-xs text-slate-400">Gov ID & Proof of Address</p>
              </div>
              <span className="flex items-center gap-1 text-xs text-[#0ecb81] font-bold">
                <CheckCircle size={14} />
                <span>Verified</span>
              </span>
            </div>
          </div>

          {/* Paper Trading Balance Controls */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <RotateCcw size={18} className="text-[#F0B90B]" />
              <h3 className="font-bold text-base text-white">Paper Trading Sandbox</h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              WiseTrade provides simulated test balances so you can practice strategy execution, risk management, and order sizing with real Binance market prices.
            </p>

            <div className="rounded-xl bg-[#121724] p-4 border border-slate-800">
              <p className="text-xs text-slate-400">Current Paper USDT Balance</p>
              <p className="text-2xl font-black text-[#F0B90B] font-mono mt-1">
                ${Number(wallet?.USDT || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <button
              type="button"
              onClick={resetDemoAccount}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-xs font-bold text-white hover:bg-slate-700 border border-slate-700 transition"
            >
              <RotateCcw size={14} />
              <span>Reset Sandbox Balances to $10,000 USDT</span>
            </button>
          </div>
        </div>

        {/* RECENT LOGIN AUDIT LOG */}
        <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-6 shadow-xl">
          <h3 className="font-bold text-base text-white mb-1">Recent Login Activity</h3>
          <p className="text-xs text-slate-400 mb-4">Security audit log of IP addresses and browser sessions</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-slate-500 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-2.5">Date & Time</th>
                  <th className="py-2.5">IP Address</th>
                  <th className="py-2.5">Device & Browser</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <tr>
                  <td className="py-3 text-slate-300">Just now</td>
                  <td className="py-3 text-white">192.168.43.171</td>
                  <td className="py-3 text-slate-400">Windows Chrome 128.0</td>
                  <td className="py-3 text-[#0ecb81]">● Authorized</td>
                </tr>
                <tr>
                  <td className="py-3 text-slate-400">Yesterday, 14:22</td>
                  <td className="py-3 text-slate-300">102.89.44.12</td>
                  <td className="py-3 text-slate-400">Windows Chrome 128.0</td>
                  <td className="py-3 text-[#0ecb81]">● Authorized</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;