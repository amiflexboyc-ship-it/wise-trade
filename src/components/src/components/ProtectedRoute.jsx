import { Navigate } from "react-router-dom";
import { useTrading } from "../context/TradingContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useTrading();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <p className="text-gray-400">
          Checking your account...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;