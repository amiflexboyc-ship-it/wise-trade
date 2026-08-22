import TradePanel from "../coponet/TradePanel";

function Trade() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        Trade
      </h1>

      <div className="max-w-xl">
        <TradePanel />
      </div>

    </div>
  );
}

export default Trade;