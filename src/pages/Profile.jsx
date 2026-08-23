import { useTrading } from "../context/TradingContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, wallet, loading } = useTrading();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 text-white">
        <p className="text-gray-400">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">

      {/* HEADER */}

      <div className="mb-8">
        <p className="text-sm uppercase tracking-widest text-[#D4AF37]">
          Account
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Profile
        </h1>

        <p className="mt-2 text-gray-400">
          Manage your WiseTrade account
        </p>
      </div>

      <div className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">

        {/* ACCOUNT CARD */}

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

          {/* AVATAR */}

          <div className="flex items-center gap-4 border-b border-slate-800 pb-6">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37] text-2xl font-bold text-black">
              {user?.email
                ? user.email.charAt(0).toUpperCase()
                : "T"}
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Trader
              </h2>

              <p className="text-sm text-gray-400">
                {user?.email || "No email available"}
              </p>
            </div>

          </div>

          {/* ACCOUNT INFORMATION */}

          <div className="mt-6 space-y-5">

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1 text-white">
                {user?.email || "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Account Type
              </p>

              <p className="mt-1 text-white">
                Paper Trading
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Account Status
              </p>

              <p className="mt-1 text-green-400">
                ● Active
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                User ID
              </p>

              <p className="mt-1 break-all text-sm text-gray-400">
                {user?.uid || "—"}
              </p>
            </div>

          </div>

        </div>

        {/* WALLET CARD */}

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-xl font-bold">
            Trading Account
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Current paper trading balances
          </p>

          <div className="mt-6 space-y-4">

            <div className="flex justify-between rounded-lg bg-slate-950 p-4">
              <span className="text-gray-400">
                USDT
              </span>

              <span className="font-bold text-[#D4AF37]">
                $
                {Number(wallet?.USDT || 0).toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </span>
            </div>

            <div className="flex justify-between rounded-lg bg-slate-950 p-4">
              <span className="text-gray-400">
                BTC
              </span>

              <span className="font-bold">
                {Number(wallet?.BTC || 0).toFixed(6)}
              </span>
            </div>

            <div className="flex justify-between rounded-lg bg-slate-950 p-4">
              <span className="text-gray-400">
                ETH
              </span>

              <span className="font-bold">
                {Number(wallet?.ETH || 0).toFixed(6)}
              </span>
            </div>

            <div className="flex justify-between rounded-lg bg-slate-950 p-4">
              <span className="text-gray-400">
                BNB
              </span>

              <span className="font-bold">
                {Number(wallet?.BNB || 0).toFixed(6)}
              </span>
            </div>

            <div className="flex justify-between rounded-lg bg-slate-950 p-4">
              <span className="text-gray-400">
                SOL
              </span>

              <span className="font-bold">
                {Number(wallet?.SOL || 0).toFixed(6)}
              </span>
            </div>

          </div>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full rounded-lg bg-red-600 py-3 font-bold text-white transition hover:bg-red-700"
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Profile;