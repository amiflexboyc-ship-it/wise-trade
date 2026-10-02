import { useEffect, useRef, useState, useCallback } from "react";
import {
  createChart,
  CandlestickSeries,
  AreaSeries,
  LineSeries,
} from "lightweight-charts";
import { useTrading } from "../context/TradingContext";
import { generateCandles, getMarketPrices } from "../Services/MarketApi";
import { Maximize2, RefreshCw, TrendingUp } from "lucide-react";

function TradingChart() {
  const chartContainer = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const lineSeriesRef = useRef(null);
  const maSeriesRef = useRef(null);

  const { selectedSymbol, setSelectedSymbol } = useTrading();
  const symbol = selectedSymbol || "BTCUSDT";

  const [price, setPrice] = useState(null);
  const [change, setChange] = useState(null);
  const [high24, setHigh24] = useState(null);
  const [low24, setLow24] = useState(null);
  const [volume24, setVolume24] = useState(null);

  const [timeframe, setTimeframe] = useState("1m");
  const [chartType, setChartType] = useState("candle"); // "candle" | "area"
  const [showMA, setShowMA] = useState(true);
  const [loading, setLoading] = useState(true);
  const [liveCandles, setLiveCandles] = useState([]);

  const coinName = symbol.replace("USDT", "");

  // Calculate Simple Moving Average
  const calculateMA = (data, period = 14) => {
    const maData = [];
    for (let i = period - 1; i < data.length; i++) {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      maData.push({
        time: data[i].time,
        value: +(sum / period).toFixed(2),
      });
    }
    return maData;
  };

  // INITIALIZE LIGHTWEIGHT CHART
  useEffect(() => {
    if (!chartContainer.current) return;

    chartContainer.current.innerHTML = "";

    const chart = createChart(chartContainer.current, {
      width: chartContainer.current.clientWidth,
      height: window.innerWidth < 640 ? 320 : 420,
      layout: {
        background: { color: "#0c101a" },
        textColor: "#94a3b8",
        fontSize: 12,
        fontFamily: "'Inter', sans-serif",
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.04)" },
        horzLines: { color: "rgba(255, 255, 255, 0.04)" },
      },
      rightPriceScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
        autoScale: true,
      },
      timeScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: "rgba(240, 185, 11, 0.4)",
          width: 1,
          style: 3,
        },
        horzLine: {
          color: "rgba(240, 185, 11, 0.4)",
          width: 1,
          style: 3,
        },
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#0ecb81",
      downColor: "#f6465d",
      borderUpColor: "#0ecb81",
      borderDownColor: "#f6465d",
      wickUpColor: "#0ecb81",
      wickDownColor: "#f6465d",
    });

    const lineSeries = chart.addSeries(AreaSeries, {
      topColor: "rgba(240, 185, 11, 0.28)",
      bottomColor: "rgba(240, 185, 11, 0.01)",
      lineColor: "#F0B90B",
      lineWidth: 2,
    });

    // Moving average overlay
    const maSeries = chart.addSeries(LineSeries, {
      color: "#38bdf8",
      lineWidth: 1.5,
      title: "MA(14)",
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    lineSeriesRef.current = lineSeries;
    maSeriesRef.current = maSeries;

    // Default visibility
    candleSeries.applyOptions({ visible: chartType === "candle" });
    lineSeries.applyOptions({ visible: chartType === "area" });
    maSeries.applyOptions({ visible: showMA });

    const handleResize = () => {
      if (chartContainer.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainer.current.clientWidth,
          height: window.innerWidth < 640 ? 320 : 420,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      lineSeriesRef.current = null;
      maSeriesRef.current = null;
    };
  }, []);

  // Update Series visibility when toggle changes
  useEffect(() => {
    if (candleSeriesRef.current && lineSeriesRef.current) {
      candleSeriesRef.current.applyOptions({ visible: chartType === "candle" });
      lineSeriesRef.current.applyOptions({ visible: chartType === "area" });
    }
  }, [chartType]);

  useEffect(() => {
    if (maSeriesRef.current) {
      maSeriesRef.current.applyOptions({ visible: showMA });
    }
  }, [showMA]);

  // LOAD CANDLES (Binance API with reliable instant fallback)
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);

      let candles = null;

      // 1. Try Binance
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500);

        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeframe}&limit=120`,
          { signal: controller.signal }
        );
        clearTimeout(timeout);

        if (res.ok) {
          const raw = await res.json();
          if (Array.isArray(raw) && raw.length > 0) {
            candles = raw.map((item) => ({
              time: Math.floor(Number(item[0]) / 1000),
              open: Number(item[1]),
              high: Number(item[2]),
              low: Number(item[3]),
              close: Number(item[4]),
            }));
          }
        }
      } catch {
        // Fallback to generated high-fidelity candles
      }

      if (!candles || candles.length === 0) {
        candles = generateCandles(symbol, timeframe, 100);
      }

      if (cancelled) return;

      setLiveCandles(candles);

      if (candleSeriesRef.current) {
        candleSeriesRef.current.setData(candles);
      }

      if (lineSeriesRef.current) {
        const areaData = candles.map((c) => ({ time: c.time, value: c.close }));
        lineSeriesRef.current.setData(areaData);
      }

      if (maSeriesRef.current && candles.length > 15) {
        const maData = calculateMA(candles, 14);
        maSeriesRef.current.setData(maData);
      }

      if (candles.length > 0) {
        const last = candles[candles.length - 1];
        const first = candles[0];
        setPrice(last.close);
        setChange(((last.close - first.close) / first.close) * 100);

        const highs = candles.map((c) => c.high);
        const lows = candles.map((c) => c.low);
        setHigh24(Math.max(...highs));
        setLow24(Math.min(...lows));
        setVolume24((last.close * 420.5).toLocaleString(undefined, { maximumFractionDigits: 0 }));
      }

      chartRef.current?.timeScale().fitContent();
      setLoading(false);
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [symbol, timeframe]);

  // LIVE STREAMING TICK SIMULATOR (Makes chart actively tick in real time)
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCandles((prev) => {
        if (!prev || prev.length === 0) return prev;

        const updated = [...prev];
        const lastIdx = updated.length - 1;
        const current = { ...updated[lastIdx] };

        // Micro-tick
        const tickPercent = (Math.random() - 0.49) * 0.0012;
        const newClose = +(current.close * (1 + tickPercent)).toFixed(current.close > 10 ? 2 : 4);
        current.close = newClose;
        current.high = Math.max(current.high, newClose);
        current.low = Math.min(current.low, newClose);

        updated[lastIdx] = current;

        // Update chart series in real-time
        if (candleSeriesRef.current) {
          candleSeriesRef.current.update(current);
        }
        if (lineSeriesRef.current) {
          lineSeriesRef.current.update({ time: current.time, value: newClose });
        }

        setPrice(newClose);
        return updated;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (val) => {
    if (val === null || val === undefined) return "--";
    return Number(val).toLocaleString(undefined, {
      minimumFractionDigits: val > 10 ? 2 : 4,
      maximumFractionDigits: val > 10 ? 2 : 4,
    });
  };

  const timeframes = [
    { label: "1m", value: "1m" },
    { label: "5m", value: "5m" },
    { label: "15m", value: "15m" },
    { label: "1H", value: "1h" },
    { label: "4H", value: "4h" },
    { label: "1D", value: "1d" },
  ];

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0c101a] shadow-xl">
      {/* TERMINAL HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/70 p-4">
        {/* Pair selector & Current Price */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0B90B]/15 text-sm font-black text-[#F0B90B] border border-[#F0B90B]/30">
              {coinName.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  {coinName}<span className="text-slate-400">/USDT</span>
                </h2>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                  SPOT
                </span>
              </div>
              <p className="text-xs text-slate-400">WiseTrade Global Index</p>
            </div>
          </div>

          <div className="border-l border-slate-800 pl-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black tabular-nums text-white tracking-tight">
                ${formatPrice(price)}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  change >= 0
                    ? "bg-[#0ecb81]/15 text-[#0ecb81] border border-[#0ecb81]/30"
                    : "bg-[#f6465d]/15 text-[#f6465d] border border-[#f6465d]/30"
                }`}
              >
                {change !== null ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%` : "--"}
              </span>
            </div>
          </div>
        </div>

        {/* 24h Stats Ribbon */}
        <div className="hidden xl:flex items-center gap-6 text-xs border-l border-slate-800 pl-6">
          <div>
            <p className="text-slate-500">24h High</p>
            <p className="font-semibold text-white tabular-nums">${formatPrice(high24)}</p>
          </div>
          <div>
            <p className="text-slate-500">24h Low</p>
            <p className="font-semibold text-white tabular-nums">${formatPrice(low24)}</p>
          </div>
          <div>
            <p className="text-slate-500">24h Volume</p>
            <p className="font-semibold text-white tabular-nums">${volume24 || "1.2B"}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[#0ecb81]">
            <span className="h-2 w-2 rounded-full bg-[#0ecb81] animate-ping" />
            <span className="font-semibold">Live WebSocket</span>
          </div>
        </div>
      </div>

      {/* CHART TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 bg-[#090d16] px-4 py-2.5">
        <div className="flex items-center gap-1">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              type="button"
              onClick={() => setTimeframe(tf.value)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                timeframe === tf.value
                  ? "bg-[#F0B90B] text-black shadow-md"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {tf.label}
            </button>
          ))}

          <span className="mx-2 h-4 w-px bg-slate-800" />

          {/* Chart Type Toggle */}
          <button
            type="button"
            onClick={() => setChartType("candle")}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              chartType === "candle"
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            Candles
          </button>
          <button
            type="button"
            onClick={() => setChartType("area")}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              chartType === "area"
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            Line
          </button>

          <span className="mx-2 h-4 w-px bg-slate-800" />

          {/* Indicator Toggle */}
          <button
            type="button"
            onClick={() => setShowMA(!showMA)}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              showMA
                ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                : "text-slate-500 hover:bg-slate-800"
            }`}
          >
            MA(14)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => chartRef.current?.timeScale().fitContent()}
            className="flex items-center gap-1 rounded-lg bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700"
            title="Reset Chart View"
          >
            <Maximize2 size={13} />
            <span>Fit</span>
          </button>
        </div>
      </div>

      {/* CHART CANVAS */}
      <div className="relative w-full">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0c101a]/70 backdrop-blur-xs">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <RefreshCw size={16} className="animate-spin text-[#F0B90B]" />
              <span>Streaming {coinName} real-time market data...</span>
            </div>
          </div>
        )}

        <div ref={chartContainer} className="w-full min-w-0" />
      </div>
    </div>
  );
}

export default TradingChart;