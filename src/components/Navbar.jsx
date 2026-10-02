import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTrading } from "../context/TradingContext";
import { Menu, X, ArrowRight, ShieldCheck, Zap, User } from "lucide-react";

const Navbar = () => {
  const { user, loginAsDemo } = useTrading();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDemoAccess = () => {
    loginAsDemo();
    navigate("/dashboard");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[#080b12]/90 backdrop-blur-xl border-b border-slate-800/80 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#F0B90B] to-[#fcd535] text-black font-black text-lg shadow-lg shadow-[#F0B90B]/20 group-hover:scale-105 transition">
            W
          </div>
          <span className="text-xl font-black text-white tracking-wider">
            Wise<span className="text-[#F0B90B]">Trade</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-slate-300">
          <a href="#home" className="hover:text-[#F0B90B] transition">Home</a>
          <a href="#markets" className="hover:text-[#F0B90B] transition">Live Markets</a>
          <a href="#features" className="hover:text-[#F0B90B] transition">Features</a>
          <a href="#about" className="hover:text-[#F0B90B] transition">Security & Trust</a>
          <Link to="/trade" className="text-[#0ecb81] hover:underline flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0ecb81] animate-ping" />
            Spot Terminal
          </Link>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-[#F0B90B] px-5 py-2.5 text-xs font-black text-black hover:bg-[#fcd535] transition shadow-lg shadow-[#F0B90B]/20"
            >
              <Zap size={14} />
              <span>Go to Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-[#F0B90B] px-5 py-2.5 text-xs font-black text-black hover:bg-[#fcd535] transition shadow-md shadow-[#F0B90B]/20"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0c101a] px-5 py-4 space-y-3">
          <nav className="flex flex-col gap-3 text-sm font-semibold text-slate-300">
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#F0B90B]">Home</a>
            <a href="#markets" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#F0B90B]">Markets</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#F0B90B]">Features</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#F0B90B]">About</a>
          </nav>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-xl bg-[#F0B90B] py-2.5 text-xs font-black text-black"
              >
                Dashboard
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center rounded-xl bg-[#F0B90B] py-2.5 text-xs font-black text-black hover:bg-[#fcd535]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;