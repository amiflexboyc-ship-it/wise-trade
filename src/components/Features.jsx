import {
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Globe,
  Bot,
  Headphones,
  Zap,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: <ShieldCheck size={32} className="text-[#F0B90B]" />,
    title: "Institutional Custody Vault",
    description:
      "Enterprise cold-storage simulation with multi-signature authorization and address whitelisting.",
  },
  {
    icon: <Zap size={32} className="text-[#0ecb81]" />,
    title: "Ultra-Low Latency Matching",
    description:
      "Sub-millisecond order matching engine with instant fill execution and zero slippage on spot pairs.",
  },
  {
    icon: <BarChart3 size={32} className="text-sky-400" />,
    title: "TradingView Chart Analytics",
    description:
      "Professional candlestick charts, multi-timeframe intervals, and built-in technical indicators.",
  },
  {
    icon: <Globe size={32} className="text-purple-400" />,
    title: "Global Liquidity Access",
    description:
      "Aggregated spot market depth directly linked with Binance global crypto order books.",
  },
  {
    icon: <Bot size={32} className="text-[#F0B90B]" />,
    title: "WiseTrade AI Assistant",
    description:
      "24/7 intelligent automated customer support and algorithmic trading insights.",
  },
  {
    icon: <Lock size={32} className="text-[#0ecb81]" />,
    title: "Risk-Free Paper Sandbox",
    description:
      "Practice strategy execution with $10,000 in simulated funds before deploying real capital.",
  },
];

const Features = () => {
  return (
    <section id="features" className="bg-[#07090e] text-white py-24 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F0B90B]">
            Engineered For Speed & Safety
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-1">
            Why Professional Traders Choose{" "}
            <span className="text-[#F0B90B]">WiseTrade</span>
          </h2>
          <p className="text-slate-400 mt-3 text-sm max-w-2xl mx-auto">
            Experience next-level cryptocurrency trading with institutional tools and real-time execution.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-3xl border border-slate-800/80 bg-[#0c101a] p-8 hover:border-[#F0B90B]/50 hover:bg-[#121724] transition-all duration-300 shadow-xl"
            >
              <div className="mb-6 inline-flex p-3 rounded-2xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition duration-300">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#F0B90B] transition">
                {feature.title}
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;