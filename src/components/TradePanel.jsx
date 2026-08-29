
import { useEffect, useState } from "react";
import { useTrading } from "../context/TradingContext";
import { getMarketPrices } from "../Services/MarketApi";

function TradePanel() {
  const {
    wallet,
    buyAsset,
    sellAsset,
    loading,
    selectedSymbol,
    setSelectedSymbol,
  } = useTrading();

  const [side, setSide] = useState("BUY");
  const [amount, setAmount] = useState("");
  const [trading, setTrading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [price, setPrice] = useState(0);
  const [priceLoading, setPriceLoading] = useState(true);

  // SUPPORTED ASSETS

  const assets = [
    {
      symbol: "BTCUSDT",
      name: "Bitcoin",
      short: "BTC",
    },
    {
      symbol: "ETHUSDT",
      name: "Ethereum",
      short: "ETH",
    },
    {
      symbol: "BNBUSDT",
      name: "BNB",
      short: "BNB",
    },
    {
      symbol: "SOLUSDT",
      name: "Solana",
      short: "SOL",
    },
  ];

  // SELECTED ASSET

  const selectedAsset =
    assets.find(
      (item) =>
        item.symbol === selectedSymbol
    ) || assets[0];

  const asset = selectedAsset.short;

  // GET LIVE PRICE

  useEffect(() => {
    let mounted = true;

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

        if (
          selectedCoin &&
          mounted
        ) {
          setPrice(
            Number(selectedCoin.price)
          );
        }
      } catch (error) {
        console.error(
          "Market price error:",
          error
        );

        if (mounted) {
          setPrice(0);
        }
      } finally {
        if (mounted) {
          setPriceLoading(false);
        }
      }
    };

    loadPrice();

    const interval = setInterval(
      loadPrice,
      5000
    );

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [selectedSymbol]);

  // CHANGE ASSET

  const handleAssetChange = (symbol) => {
    if (trading) return;

    setSelectedSymbol(symbol);
    setAmount("");
    setMessage("");
    setMessageType("");
    setPrice(0);
  };

  // CALCULATIONS

  const amountNumber =
    Number(amount) || 0;

  const total =
    amountNumber * price;

  const assetBalance =
    Number(wallet?.[asset] || 0);

  const usdtBalance =
    Number(wallet?.USDT || 0);

  // TRADE

  const handleTrade = async () => {
    if (trading) return;

    setMessage("");
    setMessageType("");

    if (!price || price <= 0) {
      setMessage(
        "Market price is not available yet."
      );
      setMessageType("error");
      return;
    }

    if (amountNumber <= 0) {
      setMessage(
        `Enter a valid ${asset} amount.`
      );
      setMessageType("error");
      return;
    }

    if (
      side === "BUY" &&
      total > usdtBalance
    ) {
      setMessage(
        "Insufficient USDT balance."
      );
      setMessageType("error");
      return;
    }

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

      if (result?.success) {
        setMessage(
          result.message
        );
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
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-white">
        Loading trading account...
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-4 text-white sm:p-5">

      {/* HEADER */}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Trade
          </p>

          <h2 className="text-2xl font-bold">
            {asset}/USDT
          </h2>
        </div>

        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
          PAPER TRADING
        </span>
      </div>

      {/* ASSET SELECTOR */}

      <div className="mb-5">

        <p className="mb-2 text-sm text-gray-400">
          Select Asset
        </p>

        <div className="grid grid-cols-2 gap-2">

          {assets.map((item) => (
            <button
              key={item.symbol}
              type="button"
              disabled={trading}
              onClick={() =>
                handleAssetChange(
                  item.symbol
                )
              }
              className={`rounded-lg border p-3 text-left transition ${
                selectedSymbol ===
                item.symbol
                  ? "border-[#D4AF37] bg-[#D4AF37]/10"
                  : "border-slate-800 bg-slate-950 hover:border-slate-700"
              }`}
            >
              <p
                className={`font-bold ${
                  selectedSymbol ===
                  item.symbol
                    ? "text-[#D4AF37]"
                    : "text-white"
                }`}
              >
                {item.short}
              </p>

              <p className="text-xs text-gray-500">
                {item.name}
              </p>
            </button>
          ))}

        </div>
      </div>

      {/* BALANCES */}

      <div className="mb-5 w-full rounded-lg bg-slate-950 p-4">

        <div className="flex justify-between gap-3">
          <p className="text-sm text-gray-400">
            Available USDT
          </p>

          <p className="font-bold text-[#D4AF37]">
            ${usdtBalance.toFixed(2)}
          </p>
        </div>

        <div className="mt-3 flex justify-between gap-3">
          <p className="text-sm text-gray-400">
            {asset} Balance
          </p>

          <p className="font-bold text-white">
            {assetBalance.toFixed(6)} {asset}
          </p>
        </div>

      </div>

      {/* MESSAGE */}

      {message && (
        <div
          className={`mb-5 rounded-lg border p-4 ${
            messageType === "success"
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          <p className="font-semibold">
            {messageType === "success"
              ? "Trade Successful"
              : "Trade Failed"}
          </p>

          <p className="mt-1 text-sm">
            {message}
          </p>
        </div>
      )}

      {/* BUY / SELL */}

      <div className="mb-5 grid grid-cols-2 gap-2">

        <button
          type="button"
          disabled={trading}
          onClick={() => {
            setSide("BUY");
            setMessage("");
          }}
          className={`rounded-lg py-3 font-bold transition ${
            side === "BUY"
              ? "bg-[#D4AF37] text-black"
              : "bg-slate-800 text-gray-400 hover:bg-slate-700"
          }`}
        >
          BUY
        </button>

        <button
          type="button"
          disabled={trading}
          onClick={() => {
            setSide("SELL");
            setMessage("");
          }}
          className={`rounded-lg py-3 font-bold transition ${
            side === "SELL"
              ? "bg-red-600 text-white"
              : "bg-slate-800 text-gray-400 hover:bg-slate-700"
          }`}
        >
          SELL
        </button>

      </div>

      {/* LIVE PRICE */}

      <div className="mb-5">

        <label className="mb-2 block text-sm text-gray-400">
          {asset} Live Price
        </label>

        {priceLoading ? (
          <div className="flex items-center gap-2 text-gray-400">

            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-[#D4AF37]" />

            <span>
              Loading market price...
            </span>

          </div>
        ) : price > 0 ? (
          <p className="text-xl font-bold text-[#D4AF37]">
            $
            {price.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </p>
        ) : (
          <p className="text-red-400">
            Market price unavailable
          </p>
        )}

      </div>

      {/* AMOUNT */}

      <div className="mb-5">

        <label className="mb-2 block text-sm text-gray-400">
          Amount ({asset})
        </label>

        <input
          type="number"
          min="0"
          step="0.000001"
          value={amount}
          disabled={trading}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter"
            ) {
              handleTrade();
            }
          }}
          placeholder="0.01"
          className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-white outline-none focus:border-[#D4AF37] disabled:opacity-50"
        />

      </div>

      {/* TOTAL */}

      <div className="mb-5 flex justify-between rounded-lg bg-slate-950 p-4">

        <span className="text-gray-400">
          Total
        </span>

        <span className="font-bold text-white">
          $
          {total.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}
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
        className={`w-full rounded-lg py-3 font-bold transition ${
          trading ||
          amountNumber <= 0 ||
          price <= 0
            ? "cursor-not-allowed bg-slate-700 text-gray-500"
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

      {/* NOTICE */}

      <p className="mt-4 text-center text-xs text-gray-500">
        Paper trading only. No real funds are used.
      </p>

    </div>
  );
}

export default TradePanel;

