import { useState } from "react";
import { useTrading } from "../context/TradingContext";


function WalletActions() {
    const { wallet, setWallet } = useTrading();

    const [type, setType] = useState(null);
    const [amount, setAmount] = useState("");

    const amountNumber =
        Number(amount) || 0;

    const currentUSDT =
        Number(wallet?.USDT || 0);


    // OPEN MODAL

    const openModal = (action) => {
        setType(action);
        setAmount("");
    };

    // CLOSE MODAL

    const closeModal = () => {
        setType(null);
        setAmount("");
    };

    // HANDLE ACTION

    const handleAction = async () => {
        if (amountNumber <= 0) {
            alert("Enter a valid amount.");
            return;
        }

        const currentUSDT = Number(wallet?.USDT || 0);

        // DEPOSIT

        if (type === "deposit") {
            const newWallet = {
                ...wallet,
                USDT: currentUSDT + amountNumber,
            };

            await setWallet(newWallet);

            alert(
                `Successfully deposited $${amountNumber.toFixed(
                    2
                )}`
            );

            closeModal();
            return;
        }

        // WITHDRAW

        if (type === "withdraw") {
            if (amountNumber > currentUSDT) {
                alert("Insufficient USDT balance.");
                return;
            }

            const newWallet = {
                ...wallet,
                USDT: currentUSDT - amountNumber,
            };

            await setWallet(newWallet);

            alert(
                `Successfully withdrew $${amountNumber.toFixed(
                    2
                )}`
            );

            closeModal();
        }
    };

    return (
        <>
            {/* BUTTONS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

                <button
                    type="button"
                    onClick={() =>
                        openModal("deposit")
                    }
                    className="
            bg-[#D4AF37]
            text-black
            py-3
            rounded-lg
            font-bold
            hover:bg-[#f0c94d]
            transition
          "
                >
                    Deposit
                </button>

                <button
                    type="button"
                    onClick={() =>
                        openModal("withdraw")
                    }
                    className="
            bg-blue-800
            text-white
            py-3
            rounded-lg
            font-bold
            hover:bg-blue-600
            transition
          "
                >
                    Withdraw
                </button>

            </div>

            {/* MODAL */}

            {type && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

                    <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6">

                        {/* TITLE */}

                        <h2 className="text-2xl font-bold text-white">
                            {type === "deposit"
                                ? "Deposit USDT"
                                : "Withdraw USDT"}
                        </h2>

                        <p className="mt-2 text-sm text-gray-400">
                            {type === "deposit"
                                ? "Add simulated USDT to your paper trading wallet."
                                : "Remove simulated USDT from your paper trading wallet."}
                        </p>

                        {/* BALANCE */}

                        <div className="mt-5 rounded-lg bg-slate-950 p-4">

                            <p className="text-sm text-gray-400">
                                Available USDT
                            </p>

                            <p className="mt-1 text-xl font-bold text-[#D4AF37]">
                                ${currentUSDT.toFixed(2)}
                            </p>

                        </div>

                        {/* INPUT */}

                        <div className="mt-5">

                            <label className="mb-2 block text-sm text-gray-400">
                                Amount (USDT)
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(e.target.value)
                                }
                                placeholder="1000"
                                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-800
                  bg-slate-950
                  p-3
                  text-white
                  outline-none
                  focus:border-[#D4AF37]
                "
                            />

                        </div>

                        {/* ACTIONS */}

                        <div className="mt-6 grid grid-cols-2 gap-3">

                            <button
                                type="button"
                                onClick={closeModal}
                                className="
                  rounded-lg
                  bg-slate-800
                  py-3
                  font-bold
                  text-gray-300
                  hover:bg-slate-700
                "
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleAction}
                                className={`
                  rounded-lg
                  py-3
                  font-bold
                  ${type === "deposit"
                                        ? "bg-[#D4AF37] text-black hover:bg-[#f0c94d]"
                                        : "bg-blue-700 text-white hover:bg-blue-600"
                                    }
                `}
                            >
                                {type === "deposit"
                                    ? "Deposit"
                                    : "Withdraw"}
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </>
    );
}

export default WalletActions;