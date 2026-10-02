import { Link } from "react-router-dom";
import { ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

const stats = [
  {
    number: "250K+",
    label: "Active Global Traders",
  },
  {
    number: "$4.8B+",
    label: "Simulated Daily Volume",
  },
  {
    number: "120+",
    label: "Countries Supported",
  },
  {
    number: "99.98%",
    label: "Matching Engine Uptime",
  },
];

const About = () => {
  return (
    <section id="about" className="bg-[#090d16] text-white py-24 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side */}
        <div className="space-y-5">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F0B90B]">
            Proof of Reserves & Security
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            The Gold Standard in{" "}
            <span className="text-[#F0B90B]">Digital Asset Trading</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            WiseTrade was architected from the ground up to solve the complexity and latency of traditional trading interfaces. We combine institutional liquidity indicators, real-time market depth, and an intuitive sandbox environment.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "1:1 Simulated Proof-of-Reserves with transparent ledger logs",
              "Real-time WebSocket data streamed directly from primary crypto exchanges",
              "Institutional cold storage simulation with automated fail-safes",
              "Sub-millisecond order routing with zero hidden spreads",
            ].map((pt, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-[#0ecb81] shrink-0" />
                <span>{pt}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link
              to="/trade"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F0B90B] px-7 py-3.5 text-xs font-black text-black hover:bg-[#fcd535] transition shadow-lg shadow-[#F0B90B]/20"
            >
              <span>Explore Trading Terminal</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Right Side Stat Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-800/80 bg-[#0c101a] p-6 sm:p-8 text-center hover:border-[#F0B90B]/50 transition duration-300 shadow-xl"
            >
              <h3 className="text-3xl sm:text-4xl font-black text-[#F0B90B] tabular-nums font-mono">
                {item.number}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm font-semibold mt-2">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;