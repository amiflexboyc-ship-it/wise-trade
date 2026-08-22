const coins = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: "$118,450",
    change: "+3.25%",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: "$4,250",
    change: "+2.10%",
  },
  {
    name: "BNB",
    symbol: "BNB",
    price: "$825",
    change: "+1.45%",
  },
  {
    name: "Solana",
    symbol: "SOL",
    price: "$212",
    change: "+4.18%",
  },
  {
    name: "XRP",
    symbol: "XRP",
    price: "$3.12",
    change: "+0.82%",
  },
  {
    name: "Cardano",
    symbol: "ADA",
    price: "$1.18",
    change: "+1.74%",
  },
];

const Markets = () => {
  return (
    <section
      id="markets"
      className="bg-slate-900 text-white py-24"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <h2 className="text-5xl font-bold">
            Live <span className="text-cyan-400">Markets</span>
          </h2>

          <p className="text-gray-400 mt-4">
            Track the world's most popular cryptocurrencies.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {coins.map((coin) => (
            <div
              key={coin.symbol}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-cyan-400 hover:-translate-y-2 duration-300"
            >
              <div className="flex justify-between items-center">

                <div>
                  <h3 className="text-2xl font-bold">
                    {coin.name}
                  </h3>

                  <p className="text-gray-500">
                    {coin.symbol}
                  </p>
                </div>

                <div className="w-14 h-14 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold">
                  {coin.symbol}
                </div>

              </div>

              <div className="mt-8">

                <h2 className="text-3xl font-bold">
                  {coin.price}
                </h2>

                <p className="text-green-400 mt-2">
                  {coin.change} Today
                </p>

              </div>

              <button className="mt-8 w-full bg-cyan-400 text-black py-3 rounded-xl font-semibold hover:bg-cyan-300 duration-300">
                Trade Now
              </button>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Markets;