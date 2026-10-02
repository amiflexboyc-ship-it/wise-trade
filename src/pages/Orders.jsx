import { useState, useMemo } from "react";
import { useTrading } from "../context/TradingContext";
import { Search, Filter, CheckCircle, Clock, XCircle, ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react";

function Orders() {
  const { orders = [], cancelOrder, loading } = useTrading();
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSide =
        filter === "ALL"
          ? true
          : filter === "BUY" || filter === "SELL"
          ? String(order.side).toUpperCase() === filter
          : String(order.status).toUpperCase() === filter;

      const sym = order.symbol || "";
      const matchSearch = sym.toLowerCase().includes(searchTerm.toLowerCase());

      return matchSide && matchSearch;
    });
  }, [orders, filter, searchTerm]);

  const totalVolume = useMemo(() => {
    return orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  }, [orders]);

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
        second: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] p-4 sm:p-6 lg:p-8 text-white">
      <div className="mx-auto max-w-[1700px] space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#F0B90B]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#F0B90B]">
                Order Blotter
              </span>
            </div>
            <h1 className="mt-1 text-3xl font-black text-white tracking-tight">
              Trading Order History
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Audit log of all executed, pending, and cancelled market orders
            </p>
          </div>
        </div>

        {/* 4 SUMMARY STAT TILES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-xl">
            <p className="text-xs text-slate-400">Total Executed Orders</p>
            <p className="mt-2 text-2xl font-black text-white tabular-nums">{orders.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-xl">
            <p className="text-xs text-slate-400">Buy Orders</p>
            <p className="mt-2 text-2xl font-black text-[#0ecb81] tabular-nums">
              {orders.filter((o) => String(o.side).toUpperCase() === "BUY").length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-xl">
            <p className="text-xs text-slate-400">Sell Orders</p>
            <p className="mt-2 text-2xl font-black text-[#f6465d] tabular-nums">
              {orders.filter((o) => String(o.side).toUpperCase() === "SELL").length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-xl">
            <p className="text-xs text-slate-400">Total Traded Volume</p>
            <p className="mt-2 text-2xl font-black text-[#F0B90B] tabular-nums">
              ${totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* FILTERS & SEARCH */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {["ALL", "BUY", "SELL", "COMPLETED", "CANCELLED"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilter(type)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  filter === type
                    ? "bg-[#F0B90B] text-black shadow-md shadow-[#F0B90B]/20"
                    : "bg-[#121724] text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Filter pair (e.g. BTC)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-[#121724] py-2 pl-9 pr-4 text-xs font-medium text-white outline-none focus:border-[#F0B90B]"
            />
          </div>
        </div>

        {/* ORDERS TABLE */}
        <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0c101a] shadow-xl">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No orders found matching filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-xs">
                <thead className="border-b border-slate-800/80 bg-[#090d16] text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="py-4 px-5">Order ID</th>
                    <th className="py-4 px-5">Market Pair</th>
                    <th className="py-4 px-5">Side</th>
                    <th className="py-4 px-5">Quantity</th>
                    <th className="py-4 px-5">Execution Price</th>
                    <th className="py-4 px-5">Order Total (USDT)</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5">Time</th>
                    <th className="py-4 px-5 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/40 font-mono">
                  {filteredOrders.map((order, index) => {
                    const side = String(order.side || "").toUpperCase();
                    const status = String(order.status || "COMPLETED").toUpperCase();

                    return (
                      <tr key={order.id || index} className="hover:bg-slate-800/40 transition">
                        {/* Order ID */}
                        <td className="py-4 px-5 text-slate-500 text-[11px]">
                          {order.id?.slice(0, 12) || `ord-${index}`}
                        </td>

                        {/* Market Pair */}
                        <td className="py-4 px-5 font-sans font-bold text-white text-sm">
                          {order.symbol || "BTC/USDT"}
                        </td>

                        {/* Side */}
                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-black ${
                              side === "BUY"
                                ? "bg-[#0ecb81]/15 text-[#0ecb81] border border-[#0ecb81]/30"
                                : "bg-[#f6465d]/15 text-[#f6465d] border border-[#f6465d]/30"
                            }`}
                          >
                            {side === "BUY" ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                            {side}
                          </span>
                        </td>

                        {/* Quantity */}
                        <td className="py-4 px-5 text-white font-bold tabular-nums">
                          {Number(order.amount || 0).toFixed(4)}
                        </td>

                        {/* Price */}
                        <td className="py-4 px-5 text-slate-300 tabular-nums">
                          ${Number(order.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* Total */}
                        <td className="py-4 px-5 text-[#F0B90B] font-bold tabular-nums text-sm">
                          ${Number(order.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-5 font-sans">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              status === "COMPLETED"
                                ? "bg-[#0ecb81]/15 text-[#0ecb81]"
                                : status === "CANCELLED"
                                ? "bg-slate-800 text-slate-500"
                                : "bg-[#F0B90B]/15 text-[#F0B90B]"
                            }`}
                          >
                            {status}
                          </span>
                        </td>

                        {/* Time */}
                        <td className="py-4 px-5 text-slate-500 text-[11px] font-sans">
                          {formatDate(order.createdAt || order.timestamp)}
                        </td>

                        {/* Action */}
                        <td className="py-4 px-5 text-right font-sans">
                          {status === "PENDING" ? (
                            <button
                              type="button"
                              onClick={() => cancelOrder(order.id)}
                              className="text-xs text-red-400 hover:text-red-300 underline font-semibold"
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-slate-600 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;
