import OrderHistory from "../components/OrderHistory";

function Orders() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">

      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#D4AF37]">
          Trading
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Order History
        </h1>

        <p className="mt-2 text-slate-400">
          View all your completed trades.
        </p>
      </div>

      <OrderHistory />

    </div>
  );
}

export default Orders;