import { Navigate, Outlet } from "react-router-dom";
import { useTrading } from "../context/TradingContext";

function ProtectedRoute() {
  const { user, loading } = useTrading();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 border-3 border-[#F0B90B] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          Verifying WiseTrade Session...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;