import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Ticket,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Users,
  Activity,
  DollarSign,
  Search,
} from "lucide-react";
import { useTrading } from "../context/TradingContext";
import { getAllSupportTickets } from "../Services/firestoreService";

const ADMIN_EMAILS = [
  "wadekunle744@mgail.com",
  "wadekunle744@gmail.com",
  "admin@wisetrade.io",
];

const INITIAL_DEMO_TICKETS = [
  {
    id: "tick-demo-1",
    subject: "USDT Deposit Verification",
    category: "Wallet",
    priority: "High",
    status: "OPEN",
    userEmail: "trader.demo@wisetrade.io",
    description: "I initiated a simulated TRC-20 deposit of 5,000 USDT and would like to confirm my account limits.",
    createdAt: new Date(Date.now() - 3600 * 1000 * 4),
  },
  {
    id: "tick-demo-2",
    subject: "API Key Permission Setup",
    category: "API",
    priority: "Normal",
    status: "RESOLVED",
    userEmail: "algo.trader@wisetrade.io",
    description: "Inquiry regarding WebSocket order execution latency for automated grid trading bots.",
    createdAt: new Date(Date.now() - 3600 * 1000 * 18),
  },
  {
    id: "tick-demo-3",
    subject: "VIP Tier Level 2 Upgrade",
    category: "Account",
    priority: "High",
    status: "IN PROGRESS",
    userEmail: "whale.investor@wisetrade.io",
    description: "Trading volume exceeded 100,000 USDT. Requesting manual review for zero-fee maker tier.",
    createdAt: new Date(Date.now() - 3600 * 1000 * 24),
  },
];

function AdminDashboard() {
  const { user, notify } = useTrading();
  const [tickets, setTickets] = useState(INITIAL_DEMO_TICKETS);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const normalizedUserEmail = user?.email?.trim().toLowerCase() || "";
  const isActualAdmin =
    ADMIN_EMAILS.some((adm) => adm.toLowerCase() === normalizedUserEmail) ||
    Boolean(user?.isDemo);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await getAllSupportTickets();
      if (data && data.length > 0) {
        setTickets(data);
      }
    } catch {
      // Keep demo tickets if Firestore offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleUpdateStatus = (ticketId, newStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
    notify(`Ticket status updated to ${newStatus}`, "success");
  };

  const filteredTickets = tickets.filter((t) => {
    const matchStatus = filterStatus === "ALL" ? true : t.status === filterStatus;
    const matchSearch =
      (t.subject || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.userEmail || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#07090e] p-4 sm:p-6 lg:p-8 text-white">
      <div className="mx-auto max-w-[1700px] space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#F0B90B]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#F0B90B]">
                Administrative Control Panel
              </span>
            </div>
            <h1 className="mt-1 text-3xl font-black text-white tracking-tight">
              WiseTrade Admin Operations
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage platform liquidity, customer support tickets, and system health
            </p>
          </div>

          <button
            type="button"
            onClick={loadTickets}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700 border border-slate-700 transition self-start sm:self-auto"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh Tickets</span>
          </button>
        </div>

        {/* 4 KPI OVERVIEW TILES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Open Tickets</span>
              <Ticket size={16} className="text-[#F0B90B]" />
            </div>
            <p className="mt-2 text-3xl font-black text-white">
              {tickets.filter((t) => t.status === "OPEN").length}
            </p>
            <p className="mt-1 text-xs text-[#F0B90B]">Requires operator review</p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>24h Platform Turnover</span>
              <DollarSign size={16} className="text-[#0ecb81]" />
            </div>
            <p className="mt-2 text-3xl font-black text-[#0ecb81]">$48,290,120</p>
            <p className="mt-1 text-xs text-slate-400">+12.4% vs 7-day average</p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Simulated Active Accounts</span>
              <Users size={16} className="text-sky-400" />
            </div>
            <p className="mt-2 text-3xl font-black text-white">12,480</p>
            <p className="mt-1 text-xs text-sky-400">● 100% System Capacity</p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Matching Engine Latency</span>
              <Activity size={16} className="text-[#0ecb81]" />
            </div>
            <p className="mt-2 text-3xl font-black text-white">0.42 ms</p>
            <p className="mt-1 text-xs text-[#0ecb81]">Sub-millisecond SLA</p>
          </div>
        </div>

        {/* TICKET MANAGEMENT SECTION */}
        <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Ticket size={18} className="text-[#F0B90B]" />
              <h2 className="text-base font-bold text-white">Support Ticket Queue</h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-1 bg-[#121724] p-1 rounded-xl border border-slate-800">
                {["ALL", "OPEN", "IN PROGRESS", "RESOLVED"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilterStatus(st)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      filterStatus === st ? "bg-[#F0B90B] text-black" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-60">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-[#121724] py-1.5 pl-8 pr-3 text-xs text-white outline-none focus:border-[#F0B90B]"
                />
              </div>
            </div>
          </div>

          {/* TICKET CARDS / TABLE */}
          <div className="divide-y divide-slate-800/60 border border-slate-800/80 rounded-xl overflow-hidden bg-[#090d16]">
            {filteredTickets.map((t) => (
              <div key={t.id} className="p-4 sm:p-5 hover:bg-slate-800/30 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{t.subject}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        t.status === "OPEN"
                          ? "bg-[#F0B90B]/15 text-[#F0B90B] border border-[#F0B90B]/30"
                          : t.status === "RESOLVED"
                          ? "bg-[#0ecb81]/15 text-[#0ecb81] border border-[#0ecb81]/30"
                          : "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                      }`}
                    >
                      {t.status}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{t.category}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{t.description}</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono pt-1">
                    <span>User: {t.userEmail || "trader.demo@wisetrade.io"}</span>
                    <span>Priority: {t.priority || "Normal"}</span>
                    <span>Ticket ID: #{t.id.slice(-6)}</span>
                  </div>
                </div>

                {/* Operator Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(t.id, "IN PROGRESS")}
                    className="rounded-lg bg-sky-500/15 px-3 py-1.5 text-xs font-bold text-sky-400 hover:bg-sky-500/25 border border-sky-500/30 transition"
                  >
                    Set In Progress
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(t.id, "RESOLVED")}
                    className="rounded-lg bg-[#0ecb81]/15 px-3 py-1.5 text-xs font-bold text-[#0ecb81] hover:bg-[#0ecb81]/25 border border-[#0ecb81]/30 transition"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
