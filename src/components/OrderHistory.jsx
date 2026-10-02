import { useTrading } from "../context/TradingContext";
import { ArrowUpRight, ArrowDownRight, CheckCircle2 } from "lucide-react";

function OrderHistory({ limit }) {
  const { orders = [] } = useTrading();

  const displayedOrders = limit ? orders.slice(0, limit) : orders;

  const formatDate = (date) => {
    if (!date) return "—";
    try {
      const parsedDate =
        typeof date?.toDate === "function" ? date.toDate() : new Date(date);
      if (isNaN(parsedDate.getTime())) return "—";
      return parsedDate.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
        <div>
          <h3 className="font-bold text-base text-white">
            {limit ? "Recent Orders" : "Complete Order History"}
          </h3>
          <p className="text-xs text-slate-400">Filled spot trades log</p>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {orders.length} orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs">
          No executed trades yet. Open a trade on the terminal to start.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead className="text-slate-500 font-semibold border-b border-slate-800/80 text-[11px] uppercase">
              <tr>
                <th className="pb-2.5">Pair</th>
                <th className="pb-2.5">Side</th>
                <th className="pb-2.5">Amount</th>
                <th className="pb-2.5">Price</th>
                <th className="pb-2.5">Total (USDT)</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-mono">
              {displayedOrders.map((order, idx) => {
                const side = String(order.side || "").toUpperCase();

                return (
                  <tr key={order.id || idx} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 font-sans font-bold text-white text-xs">
                      {order.symbol || "BTC/USDT"}
                    </td>

                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          side === "BUY" ? "text-[#0ecb81]" : "text-[#f6465d]"
                        }`}
                      >
                        {side === "BUY" ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                        {side}
                      </span>
                    </td>

                    <td className="py-3 text-white font-bold tabular-nums">
                      {Number(order.amount || 0).toFixed(4)}
                    </td>

                    <td className="py-3 text-slate-300 tabular-nums">
                      ${Number(order.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 text-[#F0B90B] font-bold tabular-nums">
                      ${Number(order.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 font-sans">
                      <span className="rounded-full bg-[#0ecb81]/15 px-2 py-0.5 text-[10px] font-bold text-[#0ecb81]">
                        {order.status || "COMPLETED"}
                      </span>
                    </td>

                    <td className="py-3 text-right text-slate-500 text-[11px] font-sans">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
