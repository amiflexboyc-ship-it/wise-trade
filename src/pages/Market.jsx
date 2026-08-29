
import { useEffect, useState } from "react";
import { getMarketPrices } from "../Services/MarketApi";

function Market() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD LIVE MARKET PRICES
  // ==========================================

  useEffect(() => {
    let mounted = true;

    const loadMarkets = async () => {
      try {
        const data = await getMarketPrices();

        if (mounted) {
          setMarkets(data || []);
          setError("");
          setLoading(false);
        }
      } catch (err) {
        console.error("Market Error:", err);

        if (mounted) {
          setError("Unable to load market prices.");
          setLoading(false);
        }
      }
    };

    loadMarkets();

    // Update prices every 5 seconds
    const interval = setInterval(loadMarkets, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // ==========================================
  // GET COIN
  // ==========================================

  const getCoin = (symbol) => {
    return markets.find(
      (coin) => coin.symbol === symbol
    );
  };

  // ==========================================
  // FORMAT PRICE
  // ==========================================

  const formatPrice = (price) => {
    const value = Number(price || 0);

    if (value === 0) return "$0.00";

    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // ==========================================
  // COINS
  // ==========================================

  const coins = [
    {
      symbol: "BTCUSDT",
      name: "Bitcoin",
      pair: "BTC / USDT",
    },
    {
      symbol: "ETHUSDT",
      name: "Ethereum",
      pair: "ETH / USDT",
    },
    {
      symbol: "BNBUSDT",
      name: "BNB",
      pair: "BNB / USDT",
    },
    {
      symbol: "SOLUSDT",
      name: "Solana",
      pair: "SOL / USDT",
    },
  ];

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-7xl">

          <h1 className="mb-6 text-3xl font-bold">
            Markets
          </h1>

          <div className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900 p-12">
            <div className="text-center">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-[#D4AF37]" />

              <p className="mt-4 text-gray-400">
                Loading live market prices...
              </p>

            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-sm uppercase tracking-widest text-[#D4AF37]">
              Live Market
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Markets
            </h1>

            <p className="mt-2 text-gray-400">
              Live cryptocurrency prices
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">

            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-400" />

            Live • Updating every 5 seconds

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* MARKET CARDS */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {coins.map((coin) => {

            const market = getCoin(coin.symbol);

            const price = Number(
              market?.price || 0
            );

            return (
              <div
                key={coin.symbol}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-[#D4AF37]/50 hover:bg-slate-800"
              >

                {/* TOP */}

                <div className="flex items-center justify-between">

                  <div>
                    <h2 className="font-bold">
                      {coin.pair}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {coin.name}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-[#D4AF37]">
                    {coin.symbol.slice(0, 3)}
                  </div>

                </div>

                {/* PRICE */}

                <p className="mt-6 text-2xl font-bold">
                  {formatPrice(price)}
                </p>

                {/* STATUS */}

                <div className="mt-4 flex items-center justify-between">

                  <span className="text-sm text-gray-500">
                    USDT
                  </span>

                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                    Live
                  </span>

                </div>

              </div>
            );
          })}

        </div>

        {/* INFO */}

        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5">

          <h2 className="font-bold">
            Market Information
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Prices are retrieved from the live market API and
            automatically refreshed every 5 seconds.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Market;

