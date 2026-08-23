import { useEffect, useState } from "react";
import { useTrading } from "../context/TradingContext";
import { getMarketPrices } from "../services/MarketApi";


function TradePanel() {

  const {
    wallet,
    buyAsset,
    sellAsset,
    loading,
    selectedSymbol,
  } = useTrading();

  const [side, setSide] = useState("BUY");
  const [amount, setAmount] = useState("");
  const [trading, setTrading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [price, setPrice] = useState(0);
  const [priceLoading, setPriceLoading] = useState(true);


  // SELECTED ASSET

  const asset = selectedSymbol.replace(
    "USDT",
    ""
  );

  // GET LIVE PRICE

  useEffect(() => {
    const loadPrice = async () => {
      try {
        setPriceLoading(true);

        const markets =
          await getMarketPrices();

        const selectedCoin =
          markets.find(
            (coin) =>
              coin.symbol === selectedSymbol
          );

        if (selectedCoin) {
          setPrice(
            Number(selectedCoin.price)
          );
        }
      } catch (error) {
        console.error(
          "Market price error:",
          error
        );
      } finally {
        setPriceLoading(false);
      }
    };

    loadPrice();

    const interval =
      setInterval(
        loadPrice,
        5000
      );

    return () =>
      clearInterval(interval);
  }, [selectedSymbol]);

  // CALCULATIONS

  const amountNumber =
    Number(amount) || 0;

  const total =
    amountNumber * price;

  const assetBalance =
    Number(wallet?.[asset] || 0);

  const usdtBalance =
    Number(wallet?.USDT || 0);

  // BUY / SELL

  const handleTrade = async () => {
    if (trading) return;

    setMessage("");
    setMessageType("");

    if (price <= 0) {
      setMessage("Market price is not available yet.");
      setMessageType("error");
      return;
    }

    if (amountNumber <= 0) {
      setMessage(`Enter a valid ${asset} amount.`);
      setMessageType("error");
      return;
    }

    // BUY CHECK
    if (
      side === "BUY" &&
      total > usdtBalance
    ) {
      setMessage("Insufficient USDT balance.");
      setMessageType("error");
      return;
    }

    // SELL CHECK
    if (
      side === "SELL" &&
      amountNumber > assetBalance
    ) {
      setMessage(
        `Insufficient ${asset} balance.`
      );
      setMessageType("error");
      return;
    }

    try {
      setTrading(true);

      let result;

      if (side === "BUY") {
        result = await buyAsset(
          selectedSymbol,
          amountNumber,
          price
        );
      } else {
        result = await sellAsset(
          selectedSymbol,
          amountNumber,
          price
        );
      }

      console.log(
        "TRADE RESULT:",
        result
      );

      if (result?.success) {
        setMessage(result.message);
        setMessageType("success");
        setAmount("");
      } else {
        setMessage(
          result?.message ||
          "Trade failed."
        );
        setMessageType("error");
      }

    } catch (error) {
      console.error(
        "TRADE ERROR:",
        error
      );

      setMessage(
        error?.message ||
        "Something went wrong."
      );

      setMessageType("error");

    } finally {
      setTrading(false);
    }
  };

  // LOADING

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white">
        Loading trading account...
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-900 border border-slate-800 rounded-xl p-5 text-white">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          {asset} / USDT
        </h2>

        <span className="text-xs text-green-400">
          PAPER TRADING
        </span>

      </div>

      {/* BALANCES */}

      <div className="bg-slate-950 rounded-lg p-4 mb-5">

        <p className="text-gray-400 text-sm">
          Available USDT
        </p>

        <p className="text-[#D4AF37] text-xl font-bold">
          ${usdtBalance.toFixed(2)}
        </p>

        <p className="text-gray-400 text-sm mt-3">
          {asset} Balance
        </p>

        <p className="text-white text-xl font-bold">
          {assetBalance.toFixed(6)} {asset}
        </p>

      </div>


      {/* TRADE MESSAGE */}

      {message && (
        <div
          className={`
      mb-5
      p-4
      rounded-lg
      border

      ${messageType === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
            }
    `}
        >
          <p className="font-semibold">
            {messageType === "success"
              ? "Trade Successful"
              : "Trade Failed"}
          </p>

          <p className="text-sm mt-1">
            {message}
          </p>
        </div>
      )}


      {/* BUY / SELL */}

      <div className="grid grid-cols-2 gap-2 mb-5">

        <button
          type="button"
          onClick={() => setSide("BUY")}
          className={`py-3 rounded-lg font-bold ${side === "BUY"
            ? "bg-[#D4AF37] text-black"
            : "bg-slate-800 text-gray-400"
            }`}
        >
          BUY
        </button>

        <button
          type="button"
          onClick={() => setSide("SELL")}
          className={`py-3 rounded-lg font-bold ${side === "SELL"
            ? "bg-red-600 text-white"
            : "bg-slate-800 text-gray-400"
            }`}
        >
          SELL
        </button>

      </div>

      {/* LIVE PRICE */}

      <div className="mb-5">

        <label className="block text-gray-400 text-sm mb-2">
          {asset} Live Price
        </label>

        {priceLoading ? (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-4 h-4 border-2 border-gray-500 border-t-[#D4AF37] rounded-full animate-spin"></div>

            <span>
              Loading market price...
            </span>
          </div>
        ) : price > 0 ? (
          <span className="text-[#D4AF37] font-bold">
            $
            {price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        ) : (
          <div className="text-red-400">
            Market price unavailable
          </div>
        )}

      </div>

      {/* AMOUNT */}

      <div className="mb-5">

        <label className="block text-gray-400 text-sm mb-2">
          Amount ({asset})
        </label>

        <input
          type="number"
          min="0"
          step="0.000001"
          value={amount}
          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }
          placeholder="0.01"
          className="
            w-full
            bg-slate-950
            border
            border-slate-800
            rounded-lg
            p-3
            text-white
            outline-none
            focus:border-[#D4AF37]
          "
        />

      </div>

      {/* TOTAL */}

      <div className="flex justify-between bg-slate-950 rounded-lg p-4 mb-5">

        <span className="text-gray-400">
          Total
        </span>

        <span className="font-bold">
          $
          {total.toFixed(2)}
        </span>

      </div>

      {/* TRADE BUTTON */}

      <button
        type="button"
        onClick={handleTrade}
        disabled={
          trading ||
          amountNumber <= 0 ||
          price <= 0
        }
        className={`w-full py-3 rounded-lg font-bold transition ${trading ||
          amountNumber <= 0 ||
          price <= 0
          ? "bg-slate-700 text-gray-500 cursor-not-allowed"
          : side === "BUY"
            ? "bg-[#D4AF37] text-black hover:bg-[#f0c94d]"
            : "bg-red-600 text-white hover:bg-red-700"
          }`}
      >
        {trading
          ? "Processing..."
          : side === "BUY"
            ? `BUY ${asset}`
            : `SELL ${asset}`}
      </button>

    </div>
  );
}

export default TradePanel;