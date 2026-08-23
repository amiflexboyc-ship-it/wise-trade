import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";





import Loging from "./pages/Loging";
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


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <Markets />
              <TradingChart />
              <Features />
              <About />
              <Footer />
            </>
          }
        />

        {/* AUTH */}
        <Route path="/login" element={<Loging />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <div className="flex min-h-screen bg-slate-950 text-white">
              <Sidebar />

              <main className="flex-1">
                <Dashboard />
              </main>
            </div>
          }
        />
        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <div className="flex min-h-screen bg-slate-950 text-white">
              <Sidebar />

              <main className="flex-1">
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
              <main className="flex-1">
                <Market />
              </main>
            </div>
          }
        />

        {/* TRADE */}
        <Route
          path="/trade"
          element={
            <div className="flex min-h-screen bg-slate-950 text-white">
              <Sidebar />
              <main className="flex-1">
                <Trade />
              </main>
            </div>
          }
        />

        {/* WALLET */}
        <Route
          path="/wallet"
          element={
            <div className="flex min-h-screen bg-slate-950 text-white">
              <Sidebar />
              <main className="flex-1">
                <Wallet />
              </main>
            </div>
          }
        />
        {/* ORDERS */}

        <Route
          path="/orders"
          element={
            <div className="flex min-h-screen bg-slate-950 text-white">
              <Sidebar />

              <main className="flex-1">
                <Orders />
              </main>
            </div>
          }
        />
        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <div className="flex min-h-screen bg-slate-950 text-white">
              <Sidebar />
              <main className="flex-1">
                <Profile />
              </main>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;