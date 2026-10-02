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
  Sparkles,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTrading } from "../context/TradingContext";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, wallet, logout } = useTrading();

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

  const usdtBal = Number(wallet?.USDT || 0);

  return (
    <aside className="w-full shrink-0 border-b border-slate-800/80 bg-[#090d16] p-3 md:w-64 md:min-h-screen md:border-b-0 md:border-r md:p-5 flex flex-col justify-between">
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
        <nav className="flex w-full gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex shrink-0 items-center justify-between rounded-xl px-3.5 py-3 text-xs font-bold transition ${
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
      <div className="hidden md:block pt-6 border-t border-slate-800/70">
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
          className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
