import { useTrading } from "../context/TradingContext";

function Settings() {
  const { user } = useTrading();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Settings
        </h1>

        <p className="text-gray-400 mt-1">
          Manage your WiseTrade account settings
        </p>
      </div>

      <div className="max-w-2xl space-y-6">

        {/* Account Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

          <h2 className="text-xl font-bold mb-5">
            Account
          </h2>

          <div className="border-b border-slate-800 pb-4">
            <p className="text-gray-400 text-sm">
              Email
            </p>

            <p className="text-white mt-1">
              {user?.email || "Not available"}
            </p>
          </div>

          <div className="pt-4">
            <p className="text-gray-400 text-sm">
              Account Status
            </p>

            <p className="text-green-400 mt-1">
              Active
            </p>
          </div>

        </div>

        {/* Security */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

          <h2 className="text-xl font-bold mb-5">
            Security
          </h2>

          <button
            className="
              w-full
              text-left
              bg-slate-950
              border
              border-slate-800
              rounded-lg
              p-4
              hover:border-slate-600
              transition
            "
          >
            <p className="font-semibold">
              Change Password
            </p>

            <p className="text-gray-400 text-sm mt-1">
              Update your account password
            </p>
          </button>

        </div>

        {/* Trading Preferences */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

          <h2 className="text-xl font-bold mb-5">
            Trading Preferences
          </h2>

          <div className="flex items-center justify-between">

            <div>
              <p className="font-semibold">
                Default Market
              </p>

              <p className="text-gray-400 text-sm">
                Select your default trading pair
              </p>
            </div>

            <select
              className="
                bg-slate-950
                border
                border-slate-700
                rounded-lg
                px-3
                py-2
                text-white
              "
              defaultValue="BTCUSDT"
            >
              <option value="BTCUSDT">
                BTC/USDT
              </option>

              <option value="ETHUSDT">
                ETH/USDT
              </option>

              <option value="BNBUSDT">
                BNB/USDT
              </option>

              <option value="SOLUSDT">
                SOL/USDT
              </option>
            </select>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Settings;