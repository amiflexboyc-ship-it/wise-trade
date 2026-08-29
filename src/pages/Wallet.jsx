
import { useEffect, useState } from "react";

import TransactionHistory from "../components/TransactionHistory";
import WalletActions from "../components/WalletActions";
import OrderHistory from "../components/OrderHistory";

import { useTrading } from "../context/TradingContext";
import { getMarketPrices } from "../Services/MarketApi";

function Wallet() {
  const { wallet, loading } = useTrading();

  const [markets, setMarkets] = useState([]);
  const [marketLoading, setMarketLoading] = useState(true);

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
          setMarketLoading(false);
        }
      } catch (error) {
        console.error("Wallet Market Error:", error);

        if (mounted) {
          setMarketLoading(false);
        }
      }
    };

    loadMarkets();

    const interval = setInterval(loadMarkets, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-[#D4AF37]" />

          <p className="mt-4 text-gray-400">
            Loading WiseTrade...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // WALLET BALANCES
  // ==========================================

  const USDT = Number(wallet?.USDT || 0);
  const BTC = Number(wallet?.BTC || 0);
  const ETH = Number(wallet?.ETH || 0);
  const BNB = Number(wallet?.BNB || 0);
  const SOL = Number(wallet?.SOL || 0);

  const totalDeposits = Number(
    wallet?.totalDeposits || 0
  );

  const totalWithdrawals = Number(
    wallet?.totalWithdrawals || 0
  );

  // ==========================================
  // GET LIVE PRICE
  // ==========================================

  const getPrice = (symbol) => {
    return Number(
      markets.find(
        (coin) => coin.symbol === symbol
      )?.price || 0
    );
  };

  const btcPrice = getPrice("BTCUSDT");
  const ethPrice = getPrice("ETHUSDT");
  const bnbPrice = getPrice("BNBUSDT");
  const solPrice = getPrice("SOLUSDT");

  // ==========================================
  // ASSET VALUES
  // ==========================================

  const btcValue = BTC * btcPrice;
  const ethValue = ETH * ethPrice;
  const bnbValue = BNB * bnbPrice;
  const solValue = SOL * solPrice;

  // ==========================================
  // TOTAL PORTFOLIO
  // ==========================================

  const totalBalance =
    USDT +
    btcValue +
    ethValue +
    bnbValue +
    solValue;

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // ==========================================
  // PORTFOLIO PERCENTAGE
  // ==========================================

  const getPercentage = (value) => {
    if (totalBalance <= 0) {
      return 0;
    }

    return (value / totalBalance) * 100;
  };

  // ==========================================
  // ASSET ROW
  // ==========================================

  const AssetRow = ({
    symbol,
    name,
    amount,
    value,
    price,
    showProgress = false,
  }) => (
    <div className="border-b border-slate-800 py-5 last:border-b-0">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="font-semibold text-white">
            {symbol}
          </p>

          <p className="text-sm text-gray-400">
            {name}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="font-semibold text-white">
            {amount.toFixed(
              symbol === "USDT" ? 2 : 6
            )}{" "}
            {symbol}
          </p>

          <p className="text-sm text-gray-400">
            ${formatMoney(value)}
          </p>
        </div>

      </div>

      {symbol !== "USDT" && (
        <p className="mt-2 text-xs text-gray-500">
          Price: ${formatMoney(price)}
        </p>
      )}

      {showProgress && (
        <>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-[#D4AF37]"
              style={{
                width: `${Math.min(
                  getPercentage(value),
                  100
                )}%`,
              }}
            />
          </div>

          <p className="mt-2 text-xs text-gray-500">
            {getPercentage(value).toFixed(2)}% of portfolio
          </p>
        </>
      )}

    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-white sm:p-6">

      <div className="mx-auto max-w-7xl">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#D4AF37]">
            Account
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Wallet
          </h1>

          <p className="mt-1 text-gray-400">
            Manage your trading assets and transactions
          </p>
        </div>

        {/* ================================= */}
        {/* SUMMARY CARDS */}
        {/* ================================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* TOTAL PORTFOLIO */}

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-gray-400">
              Total Portfolio
            </p>

            <p className="mt-2 text-2xl font-bold text-[#D4AF37]">
              ${formatMoney(totalBalance)}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              USDT + Crypto
            </p>
          </div>

          {/* AVAILABLE USDT */}

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-gray-400">
              Available USDT
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              ${formatMoney(USDT)}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Ready to trade
            </p>
          </div>

          {/* DEPOSITS */}

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-gray-400">
              Total Deposits
            </p>

            <p className="mt-2 text-2xl font-bold text-green-400">
              +${formatMoney(totalDeposits)}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Lifetime deposits
            </p>
          </div>

          {/* WITHDRAWALS */}

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-gray-400">
              Total Withdrawals
            </p>

            <p className="mt-2 text-2xl font-bold text-red-400">
              -${formatMoney(totalWithdrawals)}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Lifetime withdrawals
            </p>
          </div>

        </div>

        {/* ================================= */}
        {/* WALLET ACTIONS */}
        {/* ================================= */}

        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-bold">
            Wallet Actions
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Add or remove simulated USDT from your paper-trading account.
          </p>

          <WalletActions />
        </div>

        {/* ================================= */}
        {/* ASSETS */}
        {/* ================================= */}

        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-5">

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

            <div>
              <h2 className="text-xl font-bold">
                Your Assets
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Current balances and live market values
              </p>
            </div>

            <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
              {marketLoading ? "UPDATING" : "LIVE"}
            </span>

          </div>

          <AssetRow
            symbol="USDT"
            name="Tether USD"
            amount={USDT}
            value={USDT}
            showProgress
          />

          <AssetRow
            symbol="BTC"
            name="Bitcoin"
            amount={BTC}
            value={btcValue}
            price={btcPrice}
          />

          <AssetRow
            symbol="ETH"
            name="Ethereum"
            amount={ETH}
            value={ethValue}
            price={ethPrice}
          />

          <AssetRow
            symbol="BNB"
            name="BNB"
            amount={BNB}
            value={bnbValue}
            price={bnbPrice}
          />

          <AssetRow
            symbol="SOL"
            name="Solana"
            amount={SOL}
            value={solValue}
            price={solPrice}
          />

        </div>

        {/* ================================= */}
        {/* TRANSACTIONS */}
        {/* ================================= */}

        <div className="mb-6">
          <TransactionHistory />
        </div>

        {/* ================================= */}
        {/* ORDERS */}
        {/* ================================= */}

        <OrderHistory />

      </div>
    </div>
  );
}

export default Wallet;


