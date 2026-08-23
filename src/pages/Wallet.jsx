import { useEffect, useState } from "react";
import WalletActions from "../components/WalletActions";
import OrderHistory from "../components/OrderHistory";
import { useTrading } from "../context/TradingContext";
import { getMarketPrices } from "../services/MarketApi";

function Wallet() {
  const { wallet, loading } = useTrading();

  // MARKET PRICES

  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        const data = await getMarketPrices();
        setMarkets(data);
      } catch (error) {
        console.error("Wallet Market Error:", error);
      }
    };

    loadMarkets();

    const interval = setInterval(
      loadMarkets,
      5000
    );

    return () => clearInterval(interval);
  }, []);

  // LOADING

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">

          <div className="w-10 h-10 mx-auto border-4 border-slate-700 border-t-[#D4AF37] rounded-full animate-spin"></div>

          <p className="mt-4 text-gray-400">
            Loading WiseTrade...
          </p>

        </div>
      </div>
    );
  }

  // WALLET BALANCES

  const USDT = Number(wallet?.USDT || 0);
  const BTC = Number(wallet?.BTC || 0);
  const ETH = Number(wallet?.ETH || 0);
  const BNB = Number(wallet?.BNB || 0);
  const SOL = Number(wallet?.SOL || 0);

  // LIVE MARKET PRICES

  const btcPrice = Number(
    markets.find(
      (coin) => coin.symbol === "BTCUSDT"
    )?.price || 0
  );

  const ethPrice = Number(
    markets.find(
      (coin) => coin.symbol === "ETHUSDT"
    )?.price || 0
  );

  const bnbPrice = Number(
    markets.find(
      (coin) => coin.symbol === "BNBUSDT"
    )?.price || 0
  );

  const solPrice = Number(
    markets.find(
      (coin) => coin.symbol === "SOLUSDT"
    )?.price || 0
  );

  // ASSET VALUES

  const btcValue = BTC * btcPrice;
  const ethValue = ETH * ethPrice;
  const bnbValue = BNB * bnbPrice;
  const solValue = SOL * solPrice;

  // TOTAL BALANCE

  const totalBalance =
    USDT +
    btcValue +
    ethValue +
    bnbValue +
    solValue;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Wallet
        </h1>

        <p className="text-gray-400 mt-1">
          Manage your trading assets
        </p>
      </div>

      {/* Total Balance */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
        <p className="text-gray-400">
          Total Balance
        </p>

        <h2 className="text-4xl font-bold text-[#D4AF37] mt-2">
          $
          {totalBalance.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}
        </h2>
      </div>

      {/* Assets */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

        <h2 className="text-xl font-bold mb-6">
          Your Assets
        </h2>

        {/* USDT */}
        <div className="flex items-center justify-between py-4 border-b border-slate-800">
          <div>
            <p className="text-white font-semibold">
              USDT
            </p>

            <p className="text-gray-400 text-sm">
              Tether USD
            </p>
          </div>

          <div className="text-right">
            <p className="text-white font-semibold">
              {USDT.toFixed(2)} USDT
            </p>

            <p className="text-gray-400 text-sm">
              ${USDT.toFixed(2)}
            </p>
          </div>
        </div>

        {/* BTC */}
        <div className="flex items-center justify-between py-4 border-b border-slate-800">
          <div>
            <p className="text-white font-semibold">
              BTC
            </p>

            <p className="text-gray-400 text-sm">
              Bitcoin
            </p>
          </div>

          <div className="text-right">
            <p className="text-white font-semibold">
              {BTC.toFixed(6)} BTC
            </p>

            <p className="text-gray-400 text-sm">
              ${btcValue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* ETH */}
        <div className="flex items-center justify-between py-4 border-b border-slate-800">
          <div>
            <p className="text-white font-semibold">
              ETH
            </p>

            <p className="text-gray-400 text-sm">
              Ethereum
            </p>
          </div>

          <div className="text-right">
            <p className="text-white font-semibold">
              {ETH.toFixed(6)} ETH
            </p>

            <p className="text-gray-400 text-sm">
              ${ethValue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* BNB */}
        <div className="flex items-center justify-between py-4 border-b border-slate-800">
          <div>
            <p className="text-white font-semibold">
              BNB
            </p>

            <p className="text-gray-400 text-sm">
              Binance Coin
            </p>
          </div>

          <div className="text-right">
            <p className="text-white font-semibold">
              {BNB.toFixed(6)} BNB
            </p>

            <p className="text-gray-400 text-sm">
              ${bnbValue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* SOL */}
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="text-white font-semibold">
              SOL
            </p>

            <p className="text-gray-400 text-sm">
              Solana
            </p>
          </div>

          <div className="text-right">
            <p className="text-white font-semibold">
              {SOL.toFixed(6)} SOL
            </p>

            <p className="text-gray-400 text-sm">
              ${solValue.toFixed(2)}
            </p>
          </div>
        </div>

      </div>

      {/* Order History */}


      <WalletActions />

      <OrderHistory />


    </div>
  );
}

export default Wallet;