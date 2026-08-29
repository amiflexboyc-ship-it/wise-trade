import {
  Home,
  ChartCandlestick,
  Wallet,
  Settings,
  LogOut,
  ClipboardList,
} from "lucide-react";

import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: Home,
    },
    {
      name: "Markets",
      path: "/market",
      icon: ChartCandlestick,
    },
    {
      name: "Trade",
      path: "/trade",
      icon: ChartCandlestick,
    },
    {
      name: "Wallet",
      path: "/wallet",
      icon: Wallet,
    },
    {
      name: "Orders",
      path: "/orders",
      icon: ClipboardList,
    },
    {
      name: "Settings",
      path: "/profile",
      icon: Settings,
    },
  ];

  return (
    <aside
      className="
        w-full
        min-w-0
        overflow-hidden
        bg-slate-950
        border-b
        border-slate-800
        p-4

        md:w-64
        md:min-h-screen
        md:border-b-0
        md:border-r
        md:p-5
      "
    >
      {/* LOGO */}

      <div className="mb-5 md:mb-10">
        <h1 className="text-2xl font-bold text-white">
          Wise<span className="text-[#D4AF37]">Trade</span>
        </h1>

        <p className="mt-1 text-xs text-gray-500">
          Paper Trading
        </p>
      </div>

      {/* NAVIGATION */}

      <nav
        className="
          flex
          w-full
          min-w-0
          gap-2
          overflow-x-auto
          pb-1

          md:flex-col
          md:gap-2
          md:overflow-visible
          md:pb-0
        "
      >
        {links.map((link) => {
          const Icon = link.icon;

          const active =
            location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`
                flex
                min-w-fit
                items-center
                gap-3
                rounded-lg
                px-4
                py-3
                transition

                ${
                  active
                    ? "bg-[#D4AF37] text-black"
                    : "text-gray-400 hover:bg-slate-900 hover:text-white"
                }
              `}
            >
              <Icon size={20} />

              <span className="font-medium">
                {link.name}
              </span>
            </Link>
          );
        })}

        {/* LOGOUT */}

        <button
          type="button"
          onClick={handleLogout}
          className="
            flex
            min-w-fit
            items-center
            gap-3
            rounded-lg
            px-4
            py-3
            text-red-400
            transition
            hover:bg-red-500/10
            hover:text-red-300

            md:mt-4
            md:w-full
          "
        >
          <LogOut size={20} />

          <span className="font-medium">
            Logout
          </span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;