import { Outlet, Link } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* Sidebar */}
      <div className="w-64 bg-slate-900 p-6">
        <h1 className="text-2xl font-bold mb-8">
          WiseTrade
        </h1>

        <nav className="space-y-4">
          <Link to="/dashboard" className="block hover:text-blue-400">
            Dashboard
          </Link>

          <Link to="/dashboard/market" className="block hover:text-blue-400">
            Market
          </Link>

          <Link to="/dashboard/trade" className="block hover:text-blue-400">
            Trade
          </Link>

          <Link to="/dashboard/wallet" className="block hover:text-blue-400">
            Wallet
          </Link>

          <Link to="/dashboard/profile" className="block hover:text-blue-400">
            Profile
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>

    </div>
  );
}

export default DashboardLayout;
