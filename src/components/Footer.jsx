import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  MessageCircle,
  Globe,
  Phone,
  Send,
  ShieldCheck,
  Check,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3500);
    }
  };

  return (
    <footer className="bg-[#05070b] border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Logo & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#F0B90B] to-[#fcd535] text-black font-black text-sm shadow-md">
                W
              </div>
              <span className="text-xl font-black text-white tracking-wider">
                Wise<span className="text-[#F0B90B]">Trade</span>
              </span>
            </Link>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Next-generation cryptocurrency paper trading terminal and market data engine. Built for beginners to master risk management and professionals to test quantitative strategies.
            </p>

            <div className="flex items-center gap-2 text-[#0ecb81] font-semibold text-[11px]">
              <span className="h-2 w-2 rounded-full bg-[#0ecb81] animate-ping" />
              <span>All Systems Operational • 99.98% SLA</span>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Terminal
            </h4>
            <ul className="space-y-2">
              <li><Link to="/trade" className="hover:text-[#F0B90B] transition">Spot Trading</Link></li>
              <li><Link to="/market" className="hover:text-[#F0B90B] transition">Market Overview</Link></li>
              <li><Link to="/wallet" className="hover:text-[#F0B90B] transition">Wallet Vault</Link></li>
              <li><Link to="/orders" className="hover:text-[#F0B90B] transition">Order Blotter</Link></li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2">
              <li><Link to="/support" className="hover:text-[#F0B90B] transition">AI Concierge & Help</Link></li>
              <li><Link to="/support" className="hover:text-[#F0B90B] transition">Submit Ticket</Link></li>
              <li><Link to="/profile" className="hover:text-[#F0B90B] transition">Security Center</Link></li>
              <li><span className="text-slate-500">API Documentation</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Market Intelligence
            </h4>
            <p className="text-slate-400 text-xs">
              Subscribe to daily liquidity updates and macro cryptocurrency news.
            </p>

            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 bg-[#0c101a] border border-slate-800 rounded-l-xl px-3 py-2 text-xs text-white outline-none focus:border-[#F0B90B]"
              />
              <button
                type="submit"
                className="bg-[#F0B90B] px-3.5 rounded-r-xl text-black font-bold hover:bg-[#fcd535] transition"
              >
                {subscribed ? <Check size={14} /> : <Send size={14} />}
              </button>
            </form>
            {subscribed && (
              <p className="text-[#0ecb81] text-[11px]">✓ Subscribed to WiseTrade Intel.</p>
            )}
          </div>
        </div>

        {/* Risk Disclaimer */}
        <div className="border-t border-slate-800/80 mt-12 pt-6 text-[11px] text-slate-500 leading-relaxed">
          <p>
            <strong className="text-slate-400 font-semibold">Simulated Paper Trading Disclaimer:</strong> WiseTrade is a simulated cryptocurrency paper trading platform designed for education and strategy testing. All transactions, deposits, order executions, and portfolio balances are simulated with no real fiat or cryptocurrency financial risk. Real-time market prices are streamed from public cryptocurrency exchange feeds.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800/50 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
          <p>© 2026 WiseTrade Inc. All rights reserved.</p>

          <div className="flex gap-6">
            <a href="#" className="hover:text-[#F0B90B] transition">Terms of Service</a>
            <a href="#" className="hover:text-[#F0B90B] transition">Privacy Policy</a>
            <a href="#" className="hover:text-[#F0B90B] transition">Cookie Policy</a>
            <a href="#" className="hover:text-[#F0B90B] transition">API Agreement</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;