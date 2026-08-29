
import TradingChart from "../components/TradingChart";
import MarketWatch from "../components/MarketWatch";
import TradePanel from "../components/TradePanel";

function Trade() {
  return (
    <div className="min-h-screen bg-slate-950 p-4 text-white sm:p-6">

      <div className="mx-auto max-w-[1600px]">

        {/* HEADER */}

        <div className="mb-6">

          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#D4AF37]">
            Trading
          </p>

          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
            Trade
          </h1>

          <p className="mt-2 text-slate-400">
            Buy and sell supported assets using live market prices.
          </p>

        </div>

        {/* TRADING AREA */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">

          {/* LEFT */}

          <div className="min-w-0 space-y-6">

            <TradingChart />

          </div>

          {/* RIGHT */}

          <aside className="grid content-start gap-6">

            <MarketWatch />

            <TradePanel />

          </aside>

        </div>

      </div>

    </div>
  );
}

export default Trade;

