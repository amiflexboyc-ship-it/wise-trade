
import { useTrading } from "../context/TradingContext";

function TransactionHistory({ limit }) {
    const { transactions } = useTrading();

    const displayedTransactions = limit
        ? transactions.slice(0, limit)
        : transactions;

    return (
        <div className="mt-6 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">

            {/* HEADER */}

            <div className="mb-5 flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">
                        {limit
                            ? "Recent Transactions"
                            : "Transaction History"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Deposits and withdrawals
                    </p>
                </div>

                <span className="text-sm text-gray-400">
                    {transactions.length} transactions
                </span>
            </div>

            {/* NO TRANSACTIONS */}

            {transactions.length === 0 ? (
                <div className="py-10 text-center">
                    <p className="text-gray-400">
                        No transactions yet.
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                        Your deposits and withdrawals will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">

                    {displayedTransactions.map(
                        (transaction) => {

                            const isDeposit =
                                transaction.type === "DEPOSIT";

                            return (
                                <div
                                    key={transaction.id}
                                    className="flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between"
                                >

                                    {/* TYPE */}

                                    <div className="flex items-center gap-3">

                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full ${isDeposit
                                                    ? "bg-green-500/10"
                                                    : "bg-red-500/10"
                                                }`}
                                        >
                                            <span
                                                className={`text-lg font-bold ${isDeposit
                                                        ? "text-green-400"
                                                        : "text-red-400"
                                                    }`}
                                            >
                                                {isDeposit ? "+" : "−"}
                                            </span>
                                        </div>

                                        <div>
                                            <p
                                                className={`font-bold ${isDeposit
                                                        ? "text-green-400"
                                                        : "text-red-400"
                                                    }`}
                                            >
                                                {transaction.type}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                USDT
                                            </p>
                                        </div>

                                    </div>

                                    {/* AMOUNT */}

                                    <div className="sm:text-right">

                                        <p className="text-lg font-bold text-white">
                                            {isDeposit ? "+" : "-"}$
                                            {Number(
                                                transaction.amount || 0
                                            ).toLocaleString(
                                                undefined,
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}
                                        </p>

                                        <span className="mt-1 inline-block rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                                            {transaction.status ||
                                                "COMPLETED"}
                                        </span>

                                    </div>

                                    {/* DATE */}

                                    <div className="sm:text-right">
                                        <p className="text-sm text-gray-400">
                                            {transaction.createdAt
                                                ? typeof transaction.createdAt.toDate === "function"
                                                    ? transaction.createdAt.toDate().toLocaleString()
                                                    : new Date(transaction.createdAt).toLocaleString()
                                                : "Processing..."}
                                        </p>
                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>
            )}

        </div>
    );
}

export default TransactionHistory;

