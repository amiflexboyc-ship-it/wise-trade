import { useEffect, useRef, useState } from "react";
import {
  createChart,
  CandlestickSeries,
} from "lightweight-charts";

import { useTrading } from "../context/TradingContext";

function TradingChart() {
  const chartContainer = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);

  const {
    selectedSymbol,
  } = useTrading();

  // Default BTC
  const symbol =
    selectedSymbol || "BTCUSDT";

  const [price, setPrice] =
    useState(null);

  const [change, setChange] =
    useState(null);

  const [timeframe, setTimeframe] =
    useState("1m");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const coinName =
    symbol.replace("USDT", "");

  // =====================================
  // CREATE CHART
  // =====================================

  useEffect(() => {
    if (!chartContainer.current) {
      return;
    }

    const chart =
      createChart(
        chartContainer.current,
        {
          width:
            chartContainer.current
              .clientWidth,

          height: 400,

          layout: {
            background: {
              color: "#0d0d0f",
            },

            textColor: "#9ca3af",
          },

          grid: {
            vertLines: {
              color: "#1e293b",
            },

            horzLines: {
              color: "#1e293b",
            },
          },

          rightPriceScale: {
            borderColor: "#334155",
          },

          timeScale: {
            borderColor: "#334155",
            timeVisible: true,
            secondsVisible: false,
          },

          crosshair: {
            mode: 1,
          },
        }
      );

    const candleSeries =
      chart.addSeries(
        CandlestickSeries,
        {
          upColor: "#22c55e",
          downColor: "#ef4444",

          borderUpColor:
            "#22c55e",

          borderDownColor:
            "#ef4444",

          wickUpColor:
            "#22c55e",

          wickDownColor:
            "#ef4444",
        }
      );

    chartRef.current = chart;

    candleSeriesRef.current =
      candleSeries;

    // =====================================
    // RESIZE
    // =====================================

    const handleResize = () => {
      if (!chartContainer.current) {
        return;
      }

      chart.applyOptions({
        width:
          chartContainer.current
            .clientWidth,
      });
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    // =====================================
    // CLEANUP
    // =====================================

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );

      chart.remove();

      chartRef.current = null;

      candleSeriesRef.current =
        null;
    };
  }, []);

  // =====================================
  // LOAD BINANCE CANDLES
  // =====================================

  useEffect(() => {
    let cancelled = false;

    const loadChart = async () => {
      try {
        setLoading(true);
        setError(false);

        console.log(
          "Loading Binance:",
          symbol,
          timeframe
        );

        // =====================================
        // BINANCE API URL
        // =====================================

        const url =
          `https://api.binance.com/api/v3/klines` +
          `?symbol=${symbol}` +
          `&interval=${timeframe}` +
          `&limit=100`;

        console.log(
          "Chart URL:",
          url
        );

        const response =
          await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Binance error: ${response.status}`
          );
        }

        const data =
          await response.json();

        if (cancelled) {
          return;
        }

        // =====================================
        // CHECK BINANCE RESPONSE
        // =====================================

        if (!Array.isArray(data)) {
          throw new Error(
            "Invalid Binance data"
          );
        }

        // =====================================
        // CONVERT CANDLES
        // =====================================

        const candles =
          data.map((item) => ({
            time: Math.floor(
              Number(item[0]) / 1000
            ),

            open: Number(item[1]),

            high: Number(item[2]),

            low: Number(item[3]),

            close: Number(item[4]),
          }));

        // =====================================
        // UPDATE CHART
        // =====================================

        if (
          candleSeriesRef.current
        ) {
          candleSeriesRef.current
            .setData(candles);
        }

        // =====================================
        // UPDATE PRICE
        // =====================================

        if (candles.length > 0) {
          const latest =
            candles[
              candles.length - 1
            ];

          setPrice(
            latest.close
          );

          // =====================================
          // PERCENTAGE CHANGE
          // =====================================

          const first =
            candles[0].close;

          const percentage =
            ((latest.close - first) /
              first) *
            100;

          setChange(
            percentage
          );
        }

        // =====================================
        // FIT CHART
        // =====================================

        chartRef.current
          ?.timeScale()
          .fitContent();

        setLoading(false);

      } catch (err) {
        console.error(
          "TradingChart error:",
          err
        );

        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    };

    // Load immediately
    loadChart();

    // Update every 5 seconds
    const interval =
      setInterval(
        loadChart,
        5000
      );

    return () => {
      cancelled = true;

      clearInterval(
        interval
      );
    };

  }, [
    symbol,
    timeframe,
  ]);

  // =====================================
  // FORMAT PRICE
  // =====================================

  const formatPrice = (value) => {
    if (
      value === null ||
      value === undefined
    ) {
      return "--";
    }

    return Number(
      value
    ).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // =====================================
  // TIMEFRAMES
  // =====================================

  const timeframes = [
    {
      label: "1m",
      value: "1m",
    },

    {
      label: "5m",
      value: "5m",
    },

    {
      label: "15m",
      value: "15m",
    },

    {
      label: "1H",
      value: "1h",
    },

    {
      label: "4H",
      value: "4h",
    },

    {
      label: "1D",
      value: "1d",
    },
  ];

  // =====================================
  // RENDER
  // =====================================

  return (
    <div className="bg-[#0d0d0f] border border-[#D4AF37] rounded-xl p-4">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-4">

        <div>

          <h2 className="text-xl font-bold text-white">
            {coinName} / USDT
          </h2>

          <p className="text-sm text-gray-400">
            {coinName === "BTC"
              ? "Bitcoin"
              : coinName === "ETH"
              ? "Ethereum"
              : coinName === "BNB"
              ? "BNB"
              : coinName === "SOL"
              ? "Solana"
              : coinName}
          </p>

        </div>

        {/* PRICE */}

        <div className="text-right">

          <div className="text-2xl font-bold text-white">

            $
            {formatPrice(price)}

          </div>

          <div
            className={`text-sm font-semibold ${
              change === null
                ? "text-gray-400"
                : change >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {change !== null
              ? `${change >= 0 ? "+" : ""}${change.toFixed(
                  2
                )}%`
              : "--"}
          </div>

        </div>

      </div>

      {/* LIVE */}

      <div className="flex justify-end mb-3">

        <span className="flex items-center gap-2 text-xs text-green-400">

          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

          LIVE

        </span>

      </div>

      {/* TIMEFRAMES */}

      <div className="flex gap-2 mb-4 flex-wrap">

        {timeframes.map(
          (item) => (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                setTimeframe(
                  item.value
                )
              }
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                timeframe ===
                item.value
                  ? "bg-[#D4AF37] text-black"
                  : "bg-slate-800 text-gray-300 hover:bg-slate-700"
              }`}
            >
              {item.label}
            </button>
          )
        )}

      </div>

      {/* CHART */}

      <div className="relative">

        {/* LOADING */}

        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0d0d0f]/60">

            <span className="text-sm text-gray-400">
              Loading{" "}
              {coinName} chart...
            </span>

          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0d0d0f]/90">

            <div className="text-center">

              <p className="text-red-400 font-semibold">
                Unable to load chart
              </p>

              <p className="text-xs text-gray-500 mt-2">
                Check your internet
                connection.
              </p>

            </div>

          </div>
        )}

        {/* CHART CONTAINER */}

        <div
          ref={chartContainer}
          className="w-full"
        />

      </div>

    </div>
  );
}

export default TradingChart;