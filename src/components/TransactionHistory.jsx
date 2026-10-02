import { useTrading } from "../context/TradingContext";
import { ArrowDownLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";

function TransactionHistory({ limit }) {
  const { transactions = [] } = useTrading();

  const displayedTransactions = limit ? transactions.slice(0, limit) : transactions;

  const formatDate = (date) => {
    if (!date) return "—";
    try {
      const parsedDate =
        typeof date?.toDate === "function" ? date.toDate() : new Date(date);
      if (isNaN(parsedDate.getTime())) return "—";
      return parsedDate.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0c101a] p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
        <div>
          <h3 className="font-bold text-base text-white">
            {limit ? "Recent Transactions" : "Wallet Transaction Ledger"}
          </h3>
          <p className="text-xs text-slate-400">Deposits and withdrawals history</p>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {transactions.length} records
        </span>
      </div>

      {transactions.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs">
          No wallet deposits or withdrawals recorded yet.
        </div>
      ) : (
        <div className="space-y-2">
          {displayedTransactions.map((tx) => {
            const isDeposit = tx.type === "DEPOSIT";

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#121724] border border-slate-800/70 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      isDeposit
                        ? "bg-[#0ecb81]/15 text-[#0ecb81]"
                        : "bg-[#f6465d]/15 text-[#f6465d]"
                    }`}
                  >
                    {isDeposit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">
                        {isDeposit ? "Deposit USDT" : "Withdraw USDT"}
                      </span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] font-mono text-slate-400">
                        {tx.network || "TRC20"}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatDate(tx.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`font-mono font-bold text-sm tabular-nums ${
                      isDeposit ? "text-[#0ecb81]" : "text-[#f6465d]"
                    }`}
                  >
                    {isDeposit ? "+" : "-"}${Number(tx.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <span className="text-[10px] text-[#0ecb81] font-semibold flex items-center justify-end gap-1">
                    <CheckCircle2 size={11} />
                    <span>Completed</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TransactionHistory;
