import { useTrading } from "../context/TradingContext";

function OrderHistory({ limit }) {
  const { orders } = useTrading();

  const displayedOrders = limit
    ? orders.slice(0, limit)
    : orders;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-xl font-bold">
          {limit ? "Recent Orders" : "Order History"}
        </h2>

        <span className="text-sm text-gray-400">
          {orders.length} orders
        </span>

      </div>

      {/* NO ORDERS */}

      {orders.length === 0 ? (

        <div className="text-center py-10">

          <p className="text-gray-400">
            No trades yet.
          </p>

          <p className="text-gray-500 text-sm mt-2">
            Your completed trades will appear here.
          </p>

        </div>

      ) : (

        <div className="space-y-3">

          {displayedOrders.map((order) => (

            <div
              key={order.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-950 border border-slate-800 rounded-lg"
            >

              {/* TRADE INFORMATION */}

              <div>

                <div className="flex items-center gap-3">

                  <span
                    className={`font-bold ${
                      order.side === "BUY"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {order.side}
                  </span>

                  <span className="text-white font-semibold">
                    {order.symbol}
                  </span>

                </div>

                <p className="text-gray-400 text-sm mt-1">
                  {Number(order.amount || 0).toFixed(6)}{" "}
                  {order.asset}
                </p>

              </div>

              {/* PRICE */}

              <div className="sm:text-right">

                <p className="text-white font-semibold">

                  $
                  {Number(
                    order.total || 0
                  ).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}

                </p>

                <p className="text-gray-400 text-sm">

                  Price: $

                  {Number(
                    order.price || 0
                  ).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}

                </p>

              </div>

              {/* DATE */}

              <div className="sm:text-right">

                <p className="text-gray-400 text-sm">

                  {order.createdAt
                    ? new Date(
                        order.createdAt
                      ).toLocaleDateString()
                    : "—"}

                </p>

                <p className="text-gray-500 text-xs mt-1">
                  Completed
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default OrderHistory;