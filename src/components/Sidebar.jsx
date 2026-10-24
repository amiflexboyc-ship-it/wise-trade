import { useState } from "react";
import {
  Home,
  CandlestickChart,
  Wallet,
  Settings,
  LogOut,
  ClipboardList,
  Headphones,
  Shield,
  Layers,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTrading } from "../context/TradingContext";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, wallet, logout } = useTrading();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Markets", path: "/market", icon: Layers },
    { name: "Spot Trading", path: "/trade", icon: CandlestickChart, badge: "LIVE" },
    { name: "Wallet Vault", path: "/wallet", icon: Wallet },
    { name: "Order Blotter", path: "/orders", icon: ClipboardList },
    { name: "Account Profile", path: "/profile", icon: Settings },
    { name: "24/7 Support", path: "/support", icon: Headphones },
    { name: "Admin Portal", path: "/admin", icon: Shield },
  ];

  // Primary bottom navigation items for mobile
  const bottomNavItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Markets", path: "/market", icon: Layers },
    { name: "Trade", path: "/trade", icon: CandlestickChart, badge: true },
    { name: "Wallet", path: "/wallet", icon: Wallet },
    { name: "Orders", path: "/orders", icon: ClipboardList },
  ];

  const usdtBal = Number(wallet?.USDT || 0);

  return (
    <>
      {/* ======================================================== */}
      {/* MOBILE TOP BAR (Visible only on < md screens) */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-800/80 bg-[#090d16]/95 px-4 py-3 backdrop-blur-xl md:hidden">
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#F0B90B] to-[#fcd535] text-sm font-black text-black shadow-md shadow-[#F0B90B]/20">
            W
          </div>
          <span className="text-base font-black tracking-wider text-white">
            Wise<span className="text-[#F0B90B]">Trade</span>
          </span>
        </Link>

        {/* Right side: Balance chip + Hamburger */}
        <div className="flex items-center gap-2">
          <Link
            to="/wallet"
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#121724] px-2.5 py-1 text-xs font-mono font-bold text-[#F0B90B]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#0ecb81]" />
            <span>${usdtBal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-[#121724] text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER OVERLAY (when hamburger is opened) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[53px] z-50 flex flex-col justify-between bg-[#090d16]/98 p-5 backdrop-blur-2xl md:hidden overflow-y-auto">
          <div>
            <div className="mb-4 rounded-xl border border-slate-800/80 bg-[#121724] p-3.5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Logged in as</span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#0ecb81]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0ecb81]" />
                  Active
                </span>
              </div>
              <p className="font-semibold text-xs text-white truncate">
                {user?.displayName || user?.email || "Paper Trader"}
              </p>
              <div className="mt-2 flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs">
                <span className="text-slate-400">Trading Balance</span>
                <span className="font-mono font-bold text-[#F0B90B]">
                  ${usdtBal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                </span>
              </div>
            </div>

            <nav className="space-y-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold transition ${
                      isActive
                        ? "bg-[#F0B90B] text-black shadow-lg shadow-[#F0B90B]/20 font-black"
                        : "text-slate-300 hover:bg-[#121724] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={17} />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && !isActive && (
                      <span className="rounded bg-[#0ecb81]/15 px-2 py-0.5 text-[10px] font-black text-[#0ecb81] border border-[#0ecb81]/30">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-6 pb-20">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/15 py-3 text-xs font-bold text-red-400 hover:bg-red-500/25 border border-red-500/30 transition"
            >
              <LogOut size={16} />
              <span>Sign Out of Terminal</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Visible only on < md screens) */}
      {/* ======================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-800/80 bg-[#090d16]/95 py-2 backdrop-blur-xl md:hidden">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-bold transition ${
                isActive ? "text-[#F0B90B]" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="relative">
                <Icon size={19} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#0ecb81]" />
                )}
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* ======================================================== */}
      {/* DESKTOP SIDEBAR (Visible only on md: screens and above) */}
      {/* ======================================================== */}
      <aside className="hidden md:flex md:w-64 md:h-screen md:sticky md:top-0 md:shrink-0 flex-col justify-between border-r border-slate-800/80 bg-[#090d16] p-5">
        {/* BRAND & LOGO */}
        <div>
          <div className="mb-6 flex items-center justify-between px-2 pt-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#F0B90B] to-[#fcd535] text-black font-black text-lg shadow-lg shadow-[#F0B90B]/20">
                W
              </div>
              <div>
                <h1 className="text-lg font-black tracking-wider text-white">
                  Wise<span className="text-[#F0B90B]">Trade</span>
                </h1>
                <p className="text-[10px] font-semibold text-slate-400 tracking-wider">
                  EXCHANGE TERMINAL
                </p>
              </div>
            </Link>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="flex flex-col gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-bold transition ${
                    isActive
                      ? "bg-[#F0B90B] text-black shadow-lg shadow-[#F0B90B]/20 font-black"
                      : "text-slate-400 hover:bg-[#121724] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && !isActive && (
                    <span className="rounded bg-[#0ecb81]/15 px-1.5 py-0.5 text-[9px] font-black text-[#0ecb81] border border-[#0ecb81]/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM USER & WALLET CHIP */}
        <div className="pt-6 border-t border-slate-800/70">
          <div className="rounded-xl bg-[#121724] p-3 border border-slate-800/80 mb-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Trading Cash</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#0ecb81]" />
            </div>
            <p className="font-mono font-bold text-sm text-[#F0B90B]">
              ${usdtBal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition cursor-pointer"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>

          {/* REGULATORY COMPLIANCE & LEGAL LINKS */}
          <div className="mt-3 pt-3 border-t border-slate-800/60 text-[10px] text-slate-500 space-y-1.5">
            <p className="leading-tight text-slate-400 font-medium">
              Trading involves risk of loss; not financial advice.
            </p>
            <div className="flex items-center justify-between text-slate-500">
              <Link to="/terms" className="hover:text-[#F0B90B] transition">Terms</Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-[#F0B90B] transition">Privacy</Link>
              <span>•</span>
              <Link to="/risk-disclaimer" className="hover:text-[#F0B90B] transition">Risk</Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
