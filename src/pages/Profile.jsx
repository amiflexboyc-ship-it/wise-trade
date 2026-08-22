import { useTrading } from "../context/TradingContext";

function Profile() {
  const { user, loading } = useTrading();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <p className="text-gray-400">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* HEADER */}

      <div className="mb-8">
        <p className="text-sm uppercase tracking-widest text-[#D4AF37]">
          Account
        </p>

        <h1 className="text-3xl font-bold mt-1">
          Profile
        </h1>

        <p className="text-gray-400 mt-2">
          Manage your WiseTrade account
        </p>
      </div>

      {/* PROFILE CARD */}

      <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-6">

        {/* AVATAR */}

        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">

          <div className="w-16 h-16 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-2xl font-bold">
            {user?.email
              ? user.email.charAt(0).toUpperCase()
              : "T"}
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Trader
            </h2>

            <p className="text-gray-400 text-sm">
              {user?.email || "No email available"}
            </p>
          </div>

        </div>

        {/* ACCOUNT INFORMATION */}

        <div className="mt-6 space-y-5">

          {/* EMAIL */}

          <div>
            <p className="text-gray-500 text-sm">
              Email
            </p>

            <p className="text-white mt-1">
              {user?.email || "—"}
            </p>
          </div>

          {/* ACCOUNT TYPE */}

          <div>
            <p className="text-gray-500 text-sm">
              Account Type
            </p>

            <p className="text-white mt-1">
              Paper Trading
            </p>
          </div>

          {/* STATUS */}

          <div>
            <p className="text-gray-500 text-sm">
              Account Status
            </p>

            <p className="text-green-400 mt-1">
              ● Active
            </p>
          </div>

          {/* USER ID */}

          <div>
            <p className="text-gray-500 text-sm">
              User ID
            </p>

            <p className="text-gray-400 text-sm mt-1 break-all">
              {user?.uid || "—"}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;