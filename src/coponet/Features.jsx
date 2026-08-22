import {
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Globe,
  Bot,
  Headphones,
} from "lucide-react";

const features = [
  {
    icon: <ShieldCheck size={40} />,
    title: "Secure Wallet",
    description:
      "Protect your assets with advanced encryption and secure authentication.",
  },
  {
    icon: <TrendingUp size={40} />,
    title: "Fast Trading",
    description:
      "Execute trades instantly with high-speed order processing.",
  },
  {
    icon: <BarChart3 size={40} />,
    title: "Live Analytics",
    description:
      "Monitor the market with real-time prices and trading insights.",
  },
  {
    icon: <Globe size={40} />,
    title: "Global Access",
    description:
      "Trade cryptocurrencies from anywhere in the world, anytime.",
  },
  {
    icon: <Bot size={40} />,
    title: "AI Insights",
    description:
      "Receive intelligent market analysis and trading suggestions.",
  },
  {
    icon: <Headphones size={40} />,
    title: "24/7 Support",
    description:
      "Our support team is always available whenever you need assistance.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="bg-slate-900 text-white py-24"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold">
            Why Choose{" "}
            <span className="text-cyan-400">
              WiseTrade
            </span>
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Everything you need to trade confidently with
            speed, security and professional tools.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-8 hover:border-cyan-400 hover:-translate-y-2 duration-300"
            >
              <div className="text-cyan-400 mb-6">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-semibold mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-400 leading-7">
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