import { useState } from "react";
import { useTrading } from "../context/TradingContext";
import { ArrowDownLeft, ArrowUpRight, Copy, Check, QrCode, Shield, RefreshCw } from "lucide-react";

function WalletActions() {
  const { wallet, depositUSDT, withdrawUSDT, notify } = useTrading();

  const [activeModal, setActiveModal] = useState(null); // "deposit" | "withdraw"
  const [network, setNetwork] = useState("TRC20");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);

  const currentUSDT = Number(wallet?.USDT || 0);

  const mockAddresses = {
    TRC20: "TQn9Y2khEsLJW1ChV8m4KkXo8xP9N1G2a4",
    ERC20: "0x71C...B29f849452474E72",
    BEP20: "0x3eF...91c3dE9047240182",
    SOL: "4k3Dyjzv58yzmZW1Kc...7zP8u",
  };

  const handleCopy = () => {
    const addr = mockAddresses[network] || mockAddresses.TRC20;
    navigator.clipboard?.writeText(addr);
    setCopied(true);
    notify("Deposit address copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDepositSubmit = async () => {
    const val = Number(amount);
    if (!val || val <= 0) {
      notify("Please enter a valid deposit amount.", "error");
      return;
    }

    setProcessing(true);
    try {
      await depositUSDT(val, network);
      setActiveModal(null);
      setAmount("");
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdrawSubmit = async () => {
    const val = Number(amount);
    if (!val || val <= 0) {
      notify("Please enter a valid withdrawal amount.", "error");
      return;
    }

    if (!address.trim()) {
      notify("Please enter a valid recipient address.", "error");
      return;
    }

    setProcessing(true);
    try {
      const res = await withdrawUSDT(val, address, network);
      if (res?.success) {
        setActiveModal(null);
        setAmount("");
        setAddress("");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            setActiveModal("deposit");
            setAmount("1000");
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0ecb81] py-3 text-xs font-black text-black hover:bg-[#0bb371] transition shadow-lg shadow-[#0ecb81]/20"
        >
          <ArrowDownLeft size={16} />
          <span>Deposit USDT</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveModal("withdraw");
            setAmount("");
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-xs font-black text-white hover:bg-slate-700 transition border border-slate-700"
        >
          <ArrowUpRight size={16} />
          <span>Withdraw USDT</span>
        </button>
      </div>

      {/* MODAL */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && !processing) setActiveModal(null);
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0c101a] p-6 shadow-2xl space-y-4">
            {/* Title */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-lg font-black text-white">
                  {activeModal === "deposit" ? "Deposit USDT" : "Withdraw USDT"}
                </h3>
                <p className="text-xs text-slate-400">
                  {activeModal === "deposit"
                    ? "Instant simulated blockchain credit"
                    : "Simulated paper trading transfer"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-500 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Network Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                Select Network
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {["TRC20", "ERC20", "BEP20", "SOL"].map((net) => (
                  <button
                    key={net}
                    type="button"
                    onClick={() => setNetwork(net)}
                    className={`rounded-lg py-2 text-xs font-bold font-mono transition ${
                      network === net
                        ? "bg-[#F0B90B] text-black"
                        : "bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800"
                    }`}
                  >
                    {net}
                  </button>
                ))}
              </div>
            </div>

            {/* DEPOSIT DETAILS (Address & QR) */}
            {activeModal === "deposit" && (
              <div className="space-y-3">
                <div className="rounded-xl bg-[#121724] p-3 border border-slate-800/70">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Deposit Address ({network})</span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-[#F0B90B] hover:underline"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copied ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                  <p className="font-mono text-xs text-white break-all">
                    {mockAddresses[network]}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1 block">
                    Amount to Credit (USDT)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1000.00"
                    className="w-full rounded-xl border border-slate-800 bg-[#121724] p-3 text-sm font-mono text-white outline-none focus:border-[#0ecb81]"
                  />
                </div>
              </div>
            )}

            {/* WITHDRAW DETAILS */}
            {activeModal === "withdraw" && (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Available Balance</span>
                    <span className="font-mono text-[#F0B90B]">${currentUSDT.toFixed(2)} USDT</span>
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={`Enter ${network} destination address`}
                    className="w-full rounded-xl border border-slate-800 bg-[#121724] p-3 text-xs font-mono text-white outline-none focus:border-[#F0B90B]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Amount</span>
                    <button
                      type="button"
                      onClick={() => setAmount(currentUSDT.toString())}
                      className="text-xs text-[#F0B90B] font-bold hover:underline"
                    >
                      MAX
                    </button>
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-800 bg-[#121724] p-3 text-sm font-mono text-white outline-none focus:border-[#F0B90B]"
                  />
                </div>

                <div className="rounded-xl bg-[#121724] p-2.5 text-[11px] text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Network Fee</span>
                    <span className="font-mono text-white">0.80 USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Arrival</span>
                    <span className="text-[#0ecb81]">Instant (Simulated)</span>
                  </div>
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                disabled={processing}
                onClick={activeModal === "deposit" ? handleDepositSubmit : handleWithdrawSubmit}
                className={`w-full rounded-xl py-3.5 text-xs font-black transition tracking-wider ${
                  activeModal === "deposit"
                    ? "bg-[#0ecb81] text-black hover:bg-[#0bb371]"
                    : "bg-[#F0B90B] text-black hover:bg-[#fcd535]"
                }`}
              >
                {processing ? (
                  "Processing Transaction..."
                ) : activeModal === "deposit" ? (
                  "Simulate Instant Deposit Credit"
                ) : (
                  "Confirm & Process Withdrawal"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WalletActions;
