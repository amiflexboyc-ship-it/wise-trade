import { useEffect, useState } from "react";

import OrderHistory from "../components/OrderHistory";
import TradingChart from "../components/TradingChart";
import MarketWatch from "../components/MarketWatch";
import TradePanel from "../components/TradePanel";

import { useTrading } from "../context/TradingContext";
import { getMarketPrices } from "../services/MarketApi";



function Dashboard() {
  const { wallet, user } = useTrading();

  const [markets, setMarkets] = useState([]);

  // LIVE MARKET PRICES

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        const data = await getMarketPrices();

        setMarkets(data);
      } catch (error) {
        console.error(
          "Dashboard Market Error:",
          error
        );
      }
    };

    loadMarkets();

    const interval = setInterval(
      loadMarkets,
      5000
    );

    return () => clearInterval(interval);
  }, []);

  // WALLET BALANCES

  const usdt = Number(
    wallet?.USDT || 0
  );

  const btc = Number(
    wallet?.BTC || 0
  );

  const eth = Number(
    wallet?.ETH || 0
  );

  const bnb = Number(
    wallet?.BNB || 0
  );

  const sol = Number(
    wallet?.SOL || 0
  );

  // GET MARKET PRICE

  const getPrice = (symbol) => {
    const coin = markets.find(
      (item) =>
        item.symbol === symbol
    );

    return Number(
      coin?.price || 0
    );
  };

  const btcPrice =
    getPrice("BTCUSDT");

  const ethPrice =
    getPrice("ETHUSDT");

  const bnbPrice =
    getPrice("BNBUSDT");

  const solPrice =
    getPrice("SOLUSDT");

  // ASSET VALUES

  const btcValue =
    btc * btcPrice;

  const ethValue =
    eth * ethPrice;

  const bnbValue =
    bnb * bnbPrice;

  const solValue =
    sol * solPrice;

  // TOTAL CRYPTO VALUE

  const cryptoValue =
    btcValue +
    ethValue +
    bnbValue +
    solValue;

  // TOTAL PORTFOLIO

  const portfolioValue =
    usdt + cryptoValue;

  // TOTAL ASSETS

  const totalAssets = 5;

  return (
    <div className="min-h-screen w-full bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">

      {/* HEADER */}

      <header className="flex flex-col gap-2 border-b border-slate-800 pb-6 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#D4AF37]">
            Overview
          </p>

          <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-400">
            Welcome back,{" "}
            {user?.email || "Trader"}
          </p>

        </div>

        <p className="text-sm text-slate-400">
          Paper trading account
        </p>

      </header>

      {/* ==PORTFOLIO SUMMARY=== */}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL BALANCE */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <p className="text-slate-400">
            Total Balance
          </p>

          <p className="text-3xl text-[#D4AF37] font-bold mt-2">
            $
            {portfolioValue.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </p>

          <p className="text-xs text-slate-500 mt-2">
            USDT + Crypto
          </p>

        </div>

        {/* AVAILABLE USDT */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <p className="text-slate-400">
            Available USDT
          </p>

          <p className="text-2xl text-white font-bold mt-2">
            $
            {usdt.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </p>

          <p className="text-xs text-slate-500 mt-2">
            Ready to trade
          </p>

        </div>

        {/* CRYPTO VALUE */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <p className="text-slate-400">
            Crypto Value
          </p>

          <p className="text-2xl text-green-400 font-bold mt-2">
            $
            {cryptoValue.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </p>

          <p className="text-xs text-slate-500 mt-2">
            BTC + ETH + BNB + SOL
          </p>

        </div>

        {/* TOTAL ASSETS */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <p className="text-slate-400">
            Total Assets
          </p>

          <p className="text-3xl text-white font-bold mt-2">
            {totalAssets}
          </p>

          <p className="text-xs text-slate-500 mt-2">
            Supported currencies
          </p>

        </div>

      </div>

      {/* ===ASSET BREAKDOWN====== */}

      <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-5">

        <h2 className="text-xl font-bold mb-5">
          Portfolio Breakdown
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* BTC */}

          <div className="bg-slate-950 rounded-lg p-4">

            <p className="text-gray-400 text-sm">
              BTC
            </p>

            <p className="text-lg font-bold mt-1">
              {btc.toFixed(6)} BTC
            </p>

            <p className="text-[#D4AF37] text-sm mt-1">
              $
              {btcValue.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </p>

          </div>

          {/* ETH */}

          <div className="bg-slate-950 rounded-lg p-4">

            <p className="text-gray-400 text-sm">
              ETH
            </p>

            <p className="text-lg font-bold mt-1">
              {eth.toFixed(6)} ETH
            </p>

            <p className="text-[#D4AF37] text-sm mt-1">
              $
              {ethValue.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </p>

          </div>

          {/* BNB */}

          <div className="bg-slate-950 rounded-lg p-4">

            <p className="text-gray-400 text-sm">
              BNB
            </p>

            <p className="text-lg font-bold mt-1">
              {bnb.toFixed(6)} BNB
            </p>

            <p className="text-[#D4AF37] text-sm mt-1">
              $
              {bnbValue.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </p>

          </div>

          {/* SOL */}

          <div className="bg-slate-950 rounded-lg p-4">

            <p className="text-gray-400 text-sm">
              SOL
            </p>

            <p className="text-lg font-bold mt-1">
              {sol.toFixed(6)} SOL
            </p>

            <p className="text-[#D4AF37] text-sm mt-1">
              $
              {solValue.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </p>

          </div>

        </div>

      </div>


      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">

        <div className="min-w-0 space-y-6">

          <TradingChart />

          <OrderHistory limit={5} />
        </div>

        <aside className="grid content-start gap-6 sm:grid-cols-2 xl:grid-cols-1">

          <MarketWatch />

          <TradePanel />

        </aside>

      </div>

    </div>
  );
}

export default Dashboard;