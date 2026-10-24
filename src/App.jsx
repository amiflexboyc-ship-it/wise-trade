import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useTrading } from "./context/TradingContext";

import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./pages/AdminDashboard";
import Support from "./pages/Support";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Market from "./pages/Market";
import Trade from "./pages/Trade";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import RiskDisclaimer from "./pages/RiskDisclaimer";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Markets from "./components/markets";
import TradingChart from "./components/TradingChart";
import Features from "./components/Features";
import About from "./components/About";
import Footer from "./components/Footer";

// Gatekeeper for root access: requires login/register before any access
function RootGate() {
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

  // If not logged in, force navigation to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, navigate straight to the Dashboard
  return <Navigate to="/dashboard" replace />;
}

// Public Showcase Landing Page
function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Markets />
      <TradingChart />
      <Features />
      <About />
      <Footer />
    </>
  );
}

function AppLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#07090e] text-white">
      <Sidebar />
      <main className="min-w-0 flex-1 pb-16 md:pb-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========================================= */}
        {/* ROOT ACCESS GATE */}
        {/* Requires login and register before access */}
        {/* ========================================= */}
        <Route path="/" element={<RootGate />} />

        {/* Optional public landing overview */}
        <Route path="/landing" element={<LandingPage />} />

        {/* ========================================= */}
        {/* AUTHENTICATION & LEGAL ROUTES */}
        {/* ========================================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/risk-disclaimer" element={<RiskDisclaimer />} />

        {/* ========================================= */}
        {/* PROTECTED ROUTES (STRICT LOGIN REQUIRED) */}
        {/* ========================================= */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/market" element={<AppLayout><Market /></AppLayout>} />
          <Route path="/trade" element={<AppLayout><Trade /></AppLayout>} />
          <Route path="/wallet" element={<AppLayout><Wallet /></AppLayout>} />
          <Route path="/orders" element={<AppLayout><Orders /></AppLayout>} />
          <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
          <Route path="/settings" element={<Navigate to="/profile" replace />} />
          <Route path="/support" element={<AppLayout><Support /></AppLayout>} />
          <Route path="/admin" element={<AppLayout><AdminDashboard /></AppLayout>} />
        </Route>

        {/* CATCH-ALL ROUTE: GATES UNKNOWN PATHS BACK TO AUTH */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;