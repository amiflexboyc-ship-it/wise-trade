import { useEffect, useState, useRef } from "react";
import {
  MessageCircle,
  Send,
  Headphones,
  Ticket,
  Plus,
  X,
  HelpCircle,
  ShieldCheck,
  Bot,
  User as UserIcon,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useTrading } from "../context/TradingContext";
import { saveSupportTicket, getSupportTickets } from "../Services/firestoreService";

function Support() {
  const { user, notify } = useTrading();

  // AI CHAT
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello 👋 I'm the WiseTrade AI Support Assistant. How can I help you today with your trading account, deposits, orders, or platform tools?",
    },
  ]);
  const [sending, setSending] = useState(false);
  const chatBottomRef = useRef(null);

  // TICKETS
  const [tickets, setTickets] = useState([]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "Trading",
    priority: "Normal",
    description: "",
  });

  // FAQ Expanders
  const [expandedFaq, setExpandedFaq] = useState(0);

  const faqs = [
    {
      q: "How does WiseTrade paper trading work?",
      a: "WiseTrade simulates real cryptocurrency trading using live market price feeds from Binance. You are credited with $10,000 simulated USDT to practice spot trading, test limit orders, and build portfolio strategies with zero financial risk.",
    },
    {
      q: "How do I deposit or add more funds?",
      a: "Navigate to the Wallet page or use the Instant Funds Simulator on the Dashboard. Select your network (TRC20, ERC20, BEP20, SOL) and enter the amount. Your simulated balance is credited instantly.",
    },
    {
      q: "What are the spot trading fees?",
      a: "WiseTrade charges a standard 0.10% taker fee on spot executions. VIP Level 1 traders receive zero-fee rebates and fee discounts.",
    },
    {
      q: "How can I reset my account back to $10,000 USDT?",
      a: "You can click 'Reset Balances' in the top right of your Dashboard or Profile page anytime to restore your account to default sandbox settings.",
    },
  ];

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load tickets
  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.uid) return;
      try {
        const data = await getSupportTickets(user.uid);
        if (data && data.length > 0) setTickets(data);
      } catch {
        // ignore
      }
    };
    fetchTickets();
  }, [user]);

  // Intelligent local responder if backend is offline
  const generateLocalSupportResponse = (text) => {
    const q = text.toLowerCase();

    if (q.includes("deposit") || q.includes("fund") || q.includes("add money")) {
      return "To deposit simulated USDT, go to the **Wallet** page or use the **Instant Funds Simulator** on your Dashboard. Select your preferred network (TRC20, ERC20, BEP20, or SOL), specify an amount, and click 'Simulate Instant Deposit Credit'.";
    }

    if (q.includes("withdraw") || q.includes("cash out")) {
      return "To withdraw simulated funds, visit your **Wallet** page, click 'Withdraw USDT', enter a recipient address, network, and amount. The transaction will process immediately in your simulated ledger.";
    }

    if (q.includes("fee") || q.includes("cost") || q.includes("commission")) {
      return "WiseTrade spot trades have a standard 0.10% trading fee. High-volume and VIP Tier 1 accounts benefit from promotional 0% fee rebates.";
    }

    if (q.includes("reset") || q.includes("restart") || q.includes("start over")) {
      return "You can easily reset your account! Simply click the **Reset Balances** button in your Dashboard or Profile header to restore your wallet back to $10,000 USDT and default crypto holdings.";
    }

    if (q.includes("order") || q.includes("limit") || q.includes("market order")) {
      return "WiseTrade supports both **Market Orders** (executed instantly at the best available index price) and **Limit Orders** (executed at your exact specified price). You can also configure optional Take Profit and Stop Loss levels in the Trade Panel.";
    }

    if (q.includes("real money") || q.includes("live") || q.includes("paper")) {
      return "WiseTrade is currently configured as a high-fidelity **Paper Trading & Market Simulation Platform**. All balances, order executions, and deposits are simulated for education and strategy testing, though market prices are streamed live from global exchanges.";
    }

    return "Thank you for reaching out! WiseTrade Support is here to help with all trading operations, orders, deposits, and account inquiries. If you need dedicated human review, feel free to open a formal Support Ticket using the 'Create Support Ticket' button!";
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInputMessage("");
    setSending(true);

    try {
      // 1. Try backend server if available with short timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch("http://127.0.0.1:5000/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
          return;
        }
      }
    } catch {
      // Backend offline: gracefully fall back to local intelligent engine
    } finally {
      setSending(false);
    }

    // Intelligent local fallback response
    setTimeout(() => {
      const reply = generateLocalSupportResponse(text);
      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    }, 400);
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      notify("Please provide a subject and description.", "error");
      return;
    }

    const newTicket = {
      id: `tick-${Date.now()}`,
      ...ticketForm,
      status: "OPEN",
      createdAt: new Date(),
    };

    setTickets((prev) => [newTicket, ...prev]);
    setShowTicketModal(false);
    setTicketForm({ subject: "", category: "Trading", priority: "Normal", description: "" });
    notify("Support ticket submitted! Ticket ID: #" + newTicket.id.slice(-6), "success", "Ticket Created");

    if (user?.uid && !user.isDemo) {
      try {
        await saveSupportTicket(user.uid, newTicket);
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] p-4 sm:p-6 lg:p-8 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Headphones size={16} className="text-[#0ecb81]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#F0B90B]">
                24/7 Concierge
              </span>
            </div>
            <h1 className="mt-1 text-3xl font-black text-white tracking-tight">
              WiseTrade Help & Support
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Instant AI assistance, ticket resolution, and platform knowledge base
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowTicketModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#F0B90B] px-4 py-2.5 text-xs font-black text-black hover:bg-[#fcd535] transition shadow-lg shadow-[#F0B90B]/20 self-start sm:self-auto"
          >
            <Plus size={15} />
            <span>Create Support Ticket</span>
          </button>
        </div>

        {/* MAIN SPLIT: AI CHAT + FAQ / TICKETS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* AI CHAT ASSISTANT (7 COLS) */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-800/80 bg-[#0c101a] flex flex-col h-[600px] shadow-xl overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 bg-[#090d16] px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0B90B]/15 text-[#F0B90B] border border-[#F0B90B]/30">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">WiseTrade AI Support</h3>
                  <span className="flex items-center gap-1.5 text-[10px] text-[#0ecb81]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0ecb81] animate-ping" />
                    Online & Ready
                  </span>
                </div>
              </div>

              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-mono text-slate-400">
                Instant Response
              </span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.sender === "ai" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F0B90B]/20 text-[#F0B90B] text-xs">
                      <Bot size={14} />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      m.sender === "user"
                        ? "bg-[#F0B90B] text-black font-semibold rounded-tr-none shadow-md"
                        : "bg-[#121724] text-slate-200 border border-slate-800/70 rounded-tl-none shadow-md"
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.sender === "user" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 text-xs">
                      <UserIcon size={14} />
                    </div>
                  )}
                </div>
              ))}
              {sending && (
                <div className="flex items-center gap-2 text-xs text-slate-500 italic">
                  <span className="h-2 w-2 rounded-full bg-[#F0B90B] animate-ping" />
                  <span>WiseTrade AI is typing...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="px-4 py-2 border-t border-slate-800/60 bg-[#090d16] flex items-center gap-1.5 overflow-x-auto text-[11px]">
              {[
                "How do I deposit funds?",
                "What are the trading fees?",
                "How to reset balance?",
                "What is paper trading?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSendMessage(suggestion)}
                  className="shrink-0 rounded-lg bg-slate-800 px-2.5 py-1 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-slate-800/80 bg-[#0c101a]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask WiseTrade Support a question..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-800 bg-[#121724] px-4 py-2.5 text-xs text-white outline-none focus:border-[#F0B90B] transition"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || sending}
                  className="rounded-xl bg-[#F0B90B] p-2.5 text-black hover:bg-[#fcd535] transition disabled:opacity-40"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* FAQ & TICKET MANAGEMENT (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            {/* FAQ Accordion */}
            <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-800/70 pb-3">
                <HelpCircle size={18} className="text-[#F0B90B]" />
                <h3 className="font-bold text-sm text-white">Frequently Asked Questions</h3>
              </div>

              <div className="space-y-2">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800/60 bg-[#121724] overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(expandedFaq === index ? -1 : index)}
                      className="w-full flex items-center justify-between p-3 text-left text-xs font-bold text-slate-200 hover:text-white"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={14}
                        className={`transform transition-transform ${expandedFaq === index ? "rotate-180" : ""}`}
                      />
                    </button>

                    {expandedFaq === index && (
                      <div className="px-3 pb-3 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50 pt-2">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* My Support Tickets */}
            <div className="rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800/70 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Ticket size={18} className="text-[#F0B90B]" />
                  <h3 className="font-bold text-sm text-white">My Support Tickets</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">{tickets.length} Opened</span>
              </div>

              {tickets.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No active support tickets. Need help? Click 'Create Support Ticket'.
                </div>
              ) : (
                <div className="space-y-2">
                  {tickets.map((t) => (
                    <div
                      key={t.id}
                      className="rounded-xl bg-[#121724] p-3 border border-slate-800/60 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">{t.subject}</span>
                        <span className="rounded-full bg-[#0ecb81]/15 px-2 py-0.5 text-[10px] font-bold text-[#0ecb81]">
                          {t.status || "OPEN"}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] line-clamp-1">{t.description}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Category: {t.category}</span>
                        <span>Priority: {t.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CREATE TICKET MODAL */}
        {showTicketModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowTicketModal(false);
            }}
          >
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0c101a] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-lg font-bold text-white">Create Support Ticket</h3>
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="text-slate-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-[#121724] p-2.5 text-white outline-none focus:border-[#F0B90B]"
                  >
                    <option value="Trading">Trading & Orders</option>
                    <option value="Wallet">Wallet & Deposits</option>
                    <option value="Account">Account Security</option>
                    <option value="API">API & Terminal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief description of the issue"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-[#121724] p-2.5 text-white outline-none focus:border-[#F0B90B]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Details</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide full details so our team can assist..."
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-[#121724] p-2.5 text-white outline-none focus:border-[#F0B90B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#F0B90B] py-3 text-xs font-black text-black hover:bg-[#fcd535] transition shadow-lg shadow-[#F0B90B]/20"
                >
                  Submit Ticket
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Support;
