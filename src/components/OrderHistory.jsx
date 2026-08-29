
import { useTrading } from "../context/TradingContext";

function OrderHistory({ limit }) {
  const { orders = [] } = useTrading();

  const displayedOrders = limit
    ? orders.slice(0, limit)
    : orders;

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    try {
      // Firestore Timestamp
      if (typeof date.toDate === "function") {
        return date.toDate().toLocaleString();
      }

      const parsedDate = new Date(date);

      if (isNaN(parsedDate.getTime())) {
        return "—";
      }

      return parsedDate.toLocaleString();
    } catch {
      return "—";
    }
  };

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  return (
    <div className="mt-6 w-full min-w-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="flex min-w-0 flex-col justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center">

        <div>
          <h2 className="text-xl font-bold">
            {limit
              ? "Recent Orders"
              : "Order History"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your completed trading activity
          </p>
        </div>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-gray-400">
          {orders.length}{" "}
          {orders.length === 1
            ? "order"
            : "orders"}
        </span>

      </div>

      {/* ================================= */}
      {/* NO ORDERS */}
      {/* ================================= */}

      {orders.length === 0 ? (

        <div className="py-12 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-2xl">
            📊
          </div>

          <p className="mt-4 font-medium text-gray-300">
            No trades yet
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Your completed trades will appear here.
          </p>

        </div>

      ) : (

        /* ================================= */
        /* ORDERS */
        /* ================================= */

        <div className="mt-4 space-y-3">

          {displayedOrders.map(
            (order, index) => {

              const side =
                String(
                  order.side || ""
                ).toUpperCase();

              return (
                <div
                  key={
                    order.id ||
                    `${order.symbol}-${index}`
                  }
                  className="flex flex-col justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950 p-4 transition hover:border-slate-700 sm:flex-row sm:items-center"
                >

                  {/* ===================== */}
                  {/* TRADE INFORMATION */}
                  {/* ===================== */}

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-3">

                      <span
                        className={`font-bold ${
                          side === "BUY"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {side || "TRADE"}
                      </span>

                      <span className="font-semibold text-white">
                        {order.symbol ||
                          "BTC/USDT"}
                      </span>

                    </div>

                    <p className="mt-1 text-sm text-gray-400">
                      {Number(
                        order.amount || 0
                      ).toFixed(6)}{" "}
                      {order.asset ||
                        ""}
                    </p>

                  </div>

                  {/* ===================== */}
                  {/* TOTAL */}
                  {/* ===================== */}

                  <div className="sm:text-right">

                    <p className="font-semibold text-white">
                      $
                      {formatMoney(
                        order.total
                      )}
                    </p>

                    <p className="text-sm text-gray-400">
                      Price: $
                      {formatMoney(
                        order.price
                      )}
                    </p>

                  </div>

                  {/* ===================== */}
                  {/* STATUS + DATE */}
                  {/* ===================== */}

                  <div className="sm:min-w-[170px] sm:text-right">

                    <span className="inline-block rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                      {order.status ||
                        "COMPLETED"}
                    </span>

                    <p className="mt-2 text-sm text-gray-400">
                      {formatDate(
                        order.createdAt
                      )}
                    </p>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

      {/* ================================= */}
      {/* SHOWING LIMIT */}
      {/* ================================= */}

      {limit &&
        orders.length > limit && (
          <p className="mt-4 text-center text-xs text-gray-500">
            Showing the latest {limit}{" "}
            orders
          </p>
        )}

    </div>
  );
}

export default OrderHistory;

