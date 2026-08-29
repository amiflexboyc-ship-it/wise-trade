
import { useState } from "react";
import { useTrading } from "../context/TradingContext";

function WalletActions() {
  const {
    wallet,
    depositUSDT,
    withdrawUSDT,
  } = useTrading();

  const [type, setType] = useState(null);
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  const amountNumber = Number(amount) || 0;

  const currentUSDT =
    Number(wallet?.USDT || 0);

  // ==========================================
  // OPEN MODAL
  // ==========================================

  const openModal = (action) => {
    setType(action);
    setAmount("");
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (processing) return;

    setType(null);
    setAmount("");
  };

  // ==========================================
  // HANDLE ACTION
  // ==========================================

  const handleAction = async () => {
    if (processing) return;

    // Validate input
    if (!amount.trim()) {
      alert("Please enter an amount.");
      return;
    }

    if (
      !Number.isFinite(amountNumber) ||
      amountNumber <= 0
    ) {
      alert("Enter a valid amount.");
      return;
    }

    // Maximum 2 decimal places
    if (!Number.isInteger(amountNumber * 100)) {
      alert(
        "Please enter an amount with no more than 2 decimal places."
      );
      return;
    }

    setProcessing(true);

    try {
      let result;

      // ========================================
      // DEPOSIT
      // ========================================

      if (type === "deposit") {
        result = await depositUSDT(
          amountNumber
        );
      }

      // ========================================
      // WITHDRAW
      // ========================================

      if (type === "withdraw") {
        result = await withdrawUSDT(
          amountNumber
        );
      }

      // ========================================
      // RESULT
      // ========================================

      if (result?.success) {
        alert(result.message);
        setType(null);
        setAmount("");
      } else {
        alert(
          result?.message ||
            "Transaction failed."
        );
      }
    } catch (error) {
      console.error(
        "Wallet action error:",
        error
      );

      alert(
        "Transaction failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      {/* ===================================== */}
      {/* ACTION BUTTONS */}
      {/* ===================================== */}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

        <button
          type="button"
          onClick={() =>
            openModal("deposit")
          }
          disabled={processing}
          className="
            rounded-lg
            bg-[#D4AF37]
            py-3
            font-bold
            text-black
            transition
            hover:bg-[#f0c94d]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Deposit
        </button>

        <button
          type="button"
          onClick={() =>
            openModal("withdraw")
          }
          disabled={processing}
          className="
            rounded-lg
            bg-blue-800
            py-3
            font-bold
            text-white
            transition
            hover:bg-blue-600
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Withdraw
        </button>

      </div>

      {/* ===================================== */}
      {/* MODAL */}
      {/* ===================================== */}

      {type && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            px-4
          "
          onClick={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !processing
            ) {
              closeModal();
            }
          }}
        >

          <div
            className="
              w-full
              max-w-md
              rounded-xl
              border
              border-slate-800
              bg-slate-900
              p-6
              shadow-2xl
            "
          >

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

            <div
              className="
                mt-5
                rounded-lg
                border
                border-slate-800
                bg-slate-950
                p-4
              "
            >
              <p className="text-sm text-gray-400">
                Available USDT
              </p>

              <p className="mt-1 text-xl font-bold text-[#D4AF37]">
                ${currentUSDT.toFixed(2)}
              </p>
            </div>

            {/* INPUT */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-medium text-gray-400">
                Amount (USDT)
              </label>

              <div className="relative">

                <span
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-500
                  "
                >
                  $
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAction();
                    }

                    if (e.key === "Escape") {
                      closeModal();
                    }
                  }}
                  placeholder="1000.00"
                  disabled={processing}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-slate-800
                    bg-slate-950
                    p-3
                    pl-8
                    text-white
                    outline-none
                    transition
                    focus:border-[#D4AF37]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                />

              </div>

            </div>

            {/* ACTIONS */}

            <div className="mt-6 grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={closeModal}
                disabled={processing}
                className="
                  rounded-lg
                  bg-slate-800
                  py-3
                  font-bold
                  text-gray-300
                  transition
                  hover:bg-slate-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAction}
                disabled={
                  processing ||
                  amountNumber <= 0
                }
                className={`
                  rounded-lg
                  py-3
                  font-bold
                  transition
                  disabled:cursor-not-allowed
                  disabled:opacity-50

                  ${
                    type === "deposit"
                      ? "bg-[#D4AF37] text-black hover:bg-[#f0c94d]"
                      : "bg-blue-700 text-white hover:bg-blue-600"
                  }
                `}
              >
                {processing
                  ? "Processing..."
                  : type === "deposit"
                  ? "Deposit"
                  : "Withdraw"}
              </button>

            </div>

            {/* DEMO NOTICE */}

            <p className="mt-5 text-center text-xs text-gray-500">
              This is a simulated paper-trading
              wallet. No real funds are transferred.
            </p>

          </div>

        </div>
      )}
    </>
  );
}

export default WalletActions;

