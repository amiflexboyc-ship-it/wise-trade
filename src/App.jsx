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
        {/* AUTHENTICATION ROUTES */}
        {/* ========================================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ========================================= */}
        {/* PROTECTED ROUTES (STRICT LOGIN REQUIRED) */}
        {/* ========================================= */}
        <Route element={<ProtectedRoute />}>
          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <div className="flex min-h-screen bg-slate-950 text-white">
                <Sidebar />
                <main className="min-w-0 flex-1">
                  <Dashboard />
                </main>
              </div>
            }
          />

          {/* MARKET */}
          <Route
            path="/market"
            element={
              <div className="flex min-h-screen bg-slate-950 text-white">
                <Sidebar />
                <main className="min-w-0 flex-1">
                  <Market />
                </main>
              </div>
            }
          />

          {/* SPOT TRADING */}
          <Route
            path="/trade"
            element={
              <div className="flex min-h-screen bg-slate-950 text-white">
                <Sidebar />
                <main className="min-w-0 flex-1">
                  <Trade />
                </main>
              </div>
            }
          />

          {/* WALLET VAULT */}
          <Route
            path="/wallet"
            element={
              <div className="flex min-h-screen bg-slate-950 text-white">
                <Sidebar />
                <main className="min-w-0 flex-1">
                  <Wallet />
                </main>
              </div>
            }
          />

          {/* ORDER BLOTTER */}
          <Route
            path="/orders"
            element={
              <div className="flex min-h-screen bg-slate-950 text-white">
                <Sidebar />
                <main className="min-w-0 flex-1">
                  <Orders />
                </main>
              </div>
            }
          />

          {/* PROFILE & SECURITY */}
          <Route
            path="/profile"
            element={
              <div className="flex min-h-screen bg-slate-950 text-white">
                <Sidebar />
                <main className="min-w-0 flex-1">
                  <Profile />
                </main>
              </div>
            }
          />

          {/* SETTINGS REDIRECT */}
          <Route path="/settings" element={<Navigate to="/profile" replace />} />

          {/* 24/7 SUPPORT & AI */}
          <Route
            path="/support"
            element={
              <div className="flex min-h-screen bg-slate-950 text-white">
                <Sidebar />
                <main className="min-w-0 flex-1">
                  <Support />
                </main>
              </div>
            }
          />

          {/* ADMIN PORTAL */}
          <Route
            path="/admin"
            element={
              <div className="flex min-h-screen bg-slate-950 text-white">
                <Sidebar />
                <main className="min-w-0 flex-1">
                  <AdminDashboard />
                </main>
              </div>
            }
          />
        </Route>

        {/* CATCH-ALL ROUTE: GATES UNKNOWN PATHS BACK TO AUTH */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;