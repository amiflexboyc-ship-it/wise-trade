import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      id="home"
      className="min-h-screen bg-slate-950 text-white flex items-center"
    >
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

        <div>
          <span className=" text-cyan-400 px-4 py-2 rounded-full">
            🚀 Trusted Crypto Trading Platform
          </span>

          <h1 className="text-5xl lg:text-7xl font-bold mt-6 leading-tight">
            Trade Smarter.
            <br />
            <span className="text-cyan-400">Grow Faster.</span>
          </h1>

          <p className="text-gray-400 mt-6 text-lg leading-8">
            Buy, sell and manage cryptocurrencies with confidence.
            WiseTrade gives you fast execution, secure transactions,
            live market data and powerful trading tools.
          </p>

          <div className="flex gap-4 mt-10">
            <Link
              to="/register"
              className="bg-cyan-400 text-black px-8 py-4 rounded-xl font-bold hover:scale-105 duration-300"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="border border-cyan-400 px-8 py-4 rounded-xl hover:bg-cyan-400 hover:text-black duration-300"
            >
              Login
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12">
            <div>
              <h2 className="text-3xl font-bold text-cyan-400">250K+</h2>
              <p className="text-gray-500">Users</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-cyan-400">$5B+</h2>
              <p className="text-gray-500">Trading Volume</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-cyan-400">120+</h2>
              <p className="text-gray-500">Countries</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex justify-center">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl w-full max-w-md">

            <h2 className="text-2xl font-bold mb-6">
              Market Overview
            </h2>

            <div className="space-y-5">

              <div className="flex justify-between">
                <span>Bitcoin</span>
                <span className="text-green-400">$118,450</span>
              </div>

              <div className="flex justify-between">
                <span>Ethereum</span>
                <span className="text-green-400">$4,250</span>
              </div>

              <div className="flex justify-between">
                <span>BNB</span>
                <span className="text-green-400">$825</span>
              </div>

              <div className="flex justify-between">
                <span>Solana</span>
                <span className="text-green-400">$212</span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;