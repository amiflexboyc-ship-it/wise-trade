
import { useEffect, useState } from "react";

import TransactionHistory from "../components/TransactionHistory";
import OrderHistory from "../components/OrderHistory";
import TradingChart from "../components/TradingChart";
import MarketWatch from "../components/MarketWatch";
import TradePanel from "../components/TradePanel";

import { useTrading } from "../context/TradingContext";
import { getMarketPrices } from "../Services/MarketApi";

function Dashboard() {
  const { wallet, user } = useTrading();

  const [markets, setMarkets] = useState([]);
  const [marketLoading, setMarketLoading] =
    useState(true);

  // LIVE MARKET PRICES

  useEffect(() => {
    let mounted = true;

    const loadMarkets = async () => {
      try {
        const data = await getMarketPrices();

        if (mounted) {
          setMarkets(data || []);
          setMarketLoading(false);
        }
      } catch (error) {
        console.error(
          "Dashboard Market Error:",
          error
        );

        if (mounted) {
          setMarketLoading(false);
        }
      }
    };

    loadMarkets();

    const interval = setInterval(
      loadMarkets,
      5000
    );

    return () => {
      mounted = false;
      clearInterval(interval);
    };
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

  // PROFIT / LOSS

  const initialBalance =
    Number(
      wallet?.initialBalance || 10000
    );

  const profitLoss =
    portfolioValue -
    initialBalance;

  const profitLossPercentage =
    initialBalance > 0
      ? (profitLoss / initialBalance) *
        100
      : 0;

  // FORMAT MONEY

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // ASSETS

  const totalAssets = 5;

  return (
    <div className="min-h-screen w-full bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">

      <div className="mx-auto max-w-[1600px]">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#D4AF37]">
              Overview
            </p>

            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 text-slate-400">
              Welcome back,{" "}
              <span className="text-slate-300">
                {user?.email || "Trader"}
              </span>
            </p>

          </div>

          {/* MARKET STATUS */}

          <div className="flex items-center gap-2 text-sm">

            <span
              className={`h-2.5 w-2.5 rounded-full ${
                marketLoading
                  ? "bg-yellow-400 animate-pulse"
                  : "bg-green-400"
              }`}
            />

            <span className="text-slate-400">
              {marketLoading
                ? "Updating markets..."
                : "Markets live"}
            </span>

          </div>

        </header>

        {/* ================================= */}
        {/* PORTFOLIO SUMMARY */}
        {/* ================================= */}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

          {/* PROFIT / LOSS */}

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-slate-400">
              Profit / Loss
            </p>

            <p
              className={`mt-2 text-2xl font-bold ${
                profitLoss >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {profitLoss >= 0
                ? "+"
                : "-"}
              $
              {formatMoney(
                Math.abs(profitLoss)
              )}
            </p>

            <p
              className={`mt-2 text-xs ${
                profitLoss >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {profitLoss >= 0
                ? "+"
                : ""}
              {profitLossPercentage.toFixed(
                2
              )}
              %
            </p>

          </div>

          {/* TOTAL BALANCE */}

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-slate-400">
              Total Balance
            </p>

            <p className="mt-2 text-3xl font-bold text-[#D4AF37]">
              $
              {formatMoney(
                portfolioValue
              )}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              USDT + Crypto
            </p>

          </div>

          {/* AVAILABLE USDT */}

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-slate-400">
              Available USDT
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              $
              {formatMoney(usdt)}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Ready to trade
            </p>

          </div>

          {/* CRYPTO VALUE */}

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-slate-400">
              Crypto Value
            </p>

            <p className="mt-2 text-2xl font-bold text-green-400">
              $
              {formatMoney(
                cryptoValue
              )}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              BTC + ETH + BNB + SOL
            </p>

          </div>

          {/* TOTAL ASSETS */}

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-slate-400">
              Total Assets
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {totalAssets}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Supported currencies
            </p>

          </div>

        </div>

        {/* ================================= */}
        {/* PORTFOLIO BREAKDOWN */}
        {/* ================================= */}

        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-xl font-bold">
              Portfolio Breakdown
            </h2>

            <span className="text-xs text-slate-500">
              Live values
            </span>

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* BTC */}

            <div className="rounded-lg bg-slate-950 p-4">

              <p className="text-sm text-gray-400">
                BTC
              </p>

              <p className="mt-1 text-lg font-bold">
                {btc.toFixed(6)} BTC
              </p>

              <p className="mt-1 text-sm text-[#D4AF37]">
                ${formatMoney(btcValue)}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Price: ${formatMoney(btcPrice)}
              </p>

            </div>

            {/* ETH */}

            <div className="rounded-lg bg-slate-950 p-4">

              <p className="text-sm text-gray-400">
                ETH
              </p>

              <p className="mt-1 text-lg font-bold">
                {eth.toFixed(6)} ETH
              </p>

              <p className="mt-1 text-sm text-[#D4AF37]">
                ${formatMoney(ethValue)}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Price: ${formatMoney(ethPrice)}
              </p>

            </div>

            {/* BNB */}

            <div className="rounded-lg bg-slate-950 p-4">

              <p className="text-sm text-gray-400">
                BNB
              </p>

              <p className="mt-1 text-lg font-bold">
                {bnb.toFixed(6)} BNB
              </p>

              <p className="mt-1 text-sm text-[#D4AF37]">
                ${formatMoney(bnbValue)}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Price: ${formatMoney(bnbPrice)}
              </p>

            </div>

            {/* SOL */}

            <div className="rounded-lg bg-slate-950 p-4">

              <p className="text-sm text-gray-400">
                SOL
              </p>

              <p className="mt-1 text-lg font-bold">
                {sol.toFixed(6)} SOL
              </p>

              <p className="mt-1 text-sm text-[#D4AF37]">
                ${formatMoney(solValue)}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Price: ${formatMoney(solPrice)}
              </p>

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* TRADING AREA */}
        {/* ================================= */}

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">

          {/* LEFT */}

          <div className="min-w-0 space-y-6">

            <TradingChart />

            <OrderHistory limit={5} />

            <TransactionHistory />

          </div>

          {/* RIGHT */}

          <aside className="grid content-start gap-6 sm:grid-cols-2 xl:grid-cols-1">

            <MarketWatch />

            <TradePanel />

          </aside>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;

