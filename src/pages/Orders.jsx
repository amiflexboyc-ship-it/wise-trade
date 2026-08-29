
import { useState } from "react";
import { useTrading } from "../context/TradingContext";

function Orders() {
  const { orders = [], loading } = useTrading();
  const [filter, setFilter] = useState("ALL");

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 text-white">
        <p className="text-gray-400">Loading orders...</p>
      </div>
    );
  }

  const filteredOrders =
    filter === "ALL"
      ? orders
      : orders.filter(
          (order) => String(order.side).toUpperCase() === filter
        );

  const formatDate = (date) => {
    if (!date) return "—";

    try {
      const parsedDate =
        typeof date?.toDate === "function" ? date.toDate() : new Date(date);

      if (isNaN(parsedDate.getTime())) return "—";

      return parsedDate.toLocaleString();
    } catch {
      return "—";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Order History</h1>

          <p className="mt-2 text-gray-400">
            View your previous trading transactions.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          {["ALL", "BUY", "SELL"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`rounded-lg px-5 py-2 font-medium transition ${
                filter === type
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-gray-400 hover:bg-slate-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          {filteredOrders.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-400">No orders found.</p>

              {filter !== "ALL" && (
                <button
                  onClick={() => setFilter("ALL")}
                  className="mt-4 text-sm text-blue-400 hover:text-blue-300"
                >
                  View all orders
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-slate-800 bg-slate-950">
                  <tr>
                    <th className="px-5 py-4 text-sm text-gray-400">
                      Pair
                    </th>

                    <th className="px-5 py-4 text-sm text-gray-400">
                      Type
                    </th>

                    <th className="px-5 py-4 text-sm text-gray-400">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-sm text-gray-400">
                      Price
                    </th>

                    <th className="px-5 py-4 text-sm text-gray-400">
                      Total
                    </th>

                    <th className="px-5 py-4 text-sm text-gray-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-sm text-gray-400">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order, index) => {
                    const side = String(order.side || "").toUpperCase();

                    return (
                      <tr
                        key={order.id || index}
                        className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50"
                      >
                        {/* Pair */}
                        <td className="px-5 py-4 font-medium">
                          {order.symbol || "BTC/USDT"}
                        </td>

                        {/* Type */}
                        <td className="px-5 py-4">
                          <span
                            className={
                              side === "BUY"
                                ? "font-semibold text-green-400"
                                : "font-semibold text-red-400"
                            }
                          >
                            {side || "—"}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-4">
                          {Number(order.amount || 0).toFixed(6)}
                        </td>

                        {/* Price */}
                        <td className="px-5 py-4">
                          $
                          {Number(order.price || 0).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </td>

                        {/* Total */}
                        <td className="px-5 py-4">
                          $
                          {Number(order.total || 0).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                            {order.status || "COMPLETED"}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4 text-sm text-gray-400">
                          {formatDate(
                            order.createdAt ||
                              order.timestamp ||
                              order.date
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

        {/* Summary */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-gray-400">Total Orders</p>
            <p className="mt-2 text-2xl font-bold">{orders.length}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-gray-400">Buy Orders</p>
            <p className="mt-2 text-2xl font-bold text-green-400">
              {orders.filter(
                (order) =>
                  String(order.side).toUpperCase() === "BUY"
              ).length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-gray-400">Sell Orders</p>
            <p className="mt-2 text-2xl font-bold text-red-400">
              {orders.filter(
                (order) =>
                  String(order.side).toUpperCase() === "SELL"
              ).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;

