import { useEffect, useState } from "react";
import { getMarketPrices } from "../services/MarketApi";
import { useTrading } from "../context/TradingContext";

function MarketWatch() {
  const [markets, setMarkets] = useState([]);

  const {
    selectedSymbol,
    setSelectedSymbol,
  } = useTrading();

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        const data =
          await getMarketPrices();

        setMarkets(data);
      } catch (error) {
        console.error(
          "Market Watch Error:",
          error
        );
      }
    };

    loadMarkets();

    const interval =
      setInterval(
        loadMarkets,
        5000
      );

    return () =>
      clearInterval(interval);
  }, []);

  const formatSymbol = (
    symbol
  ) => {
    return symbol.replace(
      "USDT",
      " / USDT"
    );
  };

  const formatPrice = (
    price
  ) => {
    return Number(
      price
    ).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  return (
    <div className="h-full bg-[#0d0d0f] border border-[#D4AF37] rounded-xl p-5">

      <h2 className="text-xl font-bold text-white mb-6">
        Market Watch
      </h2>

      <div className="space-y-3">

        {markets.map(
          (coin) => {

            const isSelected =
              selectedSymbol ===
              coin.symbol;

            return (
              <button
                key={coin.symbol}
                type="button"
                onClick={() =>
                  setSelectedSymbol(
                    coin.symbol
                  )
                }
                className={`
                  w-full
                  flex
                  items-center
                  justify-between
                  rounded-lg
                  p-3
                  text-left
                  transition
                  ${
                    isSelected
                      ? "bg-[#D4AF37]/10 border border-[#D4AF37]"
                      : "border border-transparent hover:bg-slate-800"
                  }
                `}
              >

                <span
                  className={
                    isSelected
                      ? "text-[#D4AF37] font-semibold"
                      : "text-gray-300"
                  }
                >
                  {formatSymbol(
                    coin.symbol
                  )}
                </span>

                <span className="text-[#D4AF37] font-semibold">
                  $
                  {formatPrice(
                    coin.price
                  )}
                </span>

              </button>
            );
          }
        )}

      </div>

    </div>
  );
}

export default MarketWatch;