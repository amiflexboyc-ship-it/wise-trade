import { Navigate, Outlet } from "react-router-dom";
import { useTrading } from "../context/TradingContext";

function ProtectedRoute() {
  const { user, loading } = useTrading();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-gray-400">
          Loading...
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