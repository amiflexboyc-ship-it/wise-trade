import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../firebase";
import {
  getUserWallet,
  saveUserWallet,
  saveOrder,
  getUserOrders,
  saveWalletTransaction,
  getWalletTransactions,
} from "../Services/firestoreService";

const TradingContext = createContext(null);

const DEFAULT_WALLET = {
  initialBalance: 10000,
  totalDeposits: 0,
  totalWithdrawals: 0,
  USDT: 10000,
  BTC: 0.15,
  ETH: 1.25,
  SOL: 8.5,
  BNB: 2.0,
  XRP: 350,
  ADA: 500,
  DOGE: 1200,
  AVAX: 15,
};

const INITIAL_SEED_ORDERS = [
  {
    id: "ord-seed-1",
    side: "BUY",
    symbol: "BTC/USDT",
    asset: "BTC",
    amount: 0.15,
    price: 86400,
    total: 12960,
    status: "COMPLETED",
    createdAt: new Date(Date.now() - 3600 * 1000 * 14),
  },
  {
    id: "ord-seed-2",
    side: "BUY",
    symbol: "ETH/USDT",
    asset: "ETH",
    amount: 1.25,
    price: 3120,
    total: 3900,
    status: "COMPLETED",
    createdAt: new Date(Date.now() - 3600 * 1000 * 28),
  },
  {
    id: "ord-seed-3",
    side: "BUY",
    symbol: "SOL/USDT",
    asset: "SOL",
    amount: 8.5,
    price: 178,
    total: 1513,
    status: "COMPLETED",
    createdAt: new Date(Date.now() - 3600 * 1000 * 48),
  },
];

const INITIAL_SEED_TRANSACTIONS = [
  {
    id: "tx-seed-1",
    type: "DEPOSIT",
    asset: "USDT",
    amount: 10000,
    status: "COMPLETED",
    network: "TRC20",
    txHash: "0x8fa1...d92c",
    createdAt: new Date(Date.now() - 3600 * 1000 * 72),
  },
];

export function TradingProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("wisetrade_demo_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [wallet, setWalletState] = useState(() => {
    const saved = localStorage.getItem("wisetrade_wallet");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_WALLET;
      }
    }
    return DEFAULT_WALLET;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("wisetrade_orders");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_SEED_ORDERS;
      }
    }
    return INITIAL_SEED_ORDERS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("wisetrade_transactions");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_SEED_TRANSACTIONS;
      }
    }
    return INITIAL_SEED_TRANSACTIONS;
  });

  const [loading, setLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [toasts, setToasts] = useState([]);

  // Toast Notification System
  const notify = useCallback((message, type = "info", title = "") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (wallet) {
      localStorage.setItem("wisetrade_wallet", JSON.stringify(wallet));
    }
  }, [wallet]);

  useEffect(() => {
    if (orders) {
      localStorage.setItem("wisetrade_orders", JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (transactions) {
      localStorage.setItem("wisetrade_transactions", JSON.stringify(transactions));
    }
  }, [transactions]);

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        localStorage.removeItem("wisetrade_demo_user");

        try {
          const userWallet = await getUserWallet(currentUser.uid);
          const userOrders = await getUserOrders(currentUser.uid);
          const userTransactions = await getWalletTransactions(currentUser.uid);

          if (userWallet) {
            setWalletState((prev) => ({ ...DEFAULT_WALLET, ...userWallet }));
          }
          if (userOrders && userOrders.length > 0) {
            setOrders(userOrders);
          }
          if (userTransactions && userTransactions.length > 0) {
            setTransactions(userTransactions);
          }
        } catch (err) {
          console.warn("Firestore sync fallback to local store:", err.message);
        }
      } else {
        const demoStored = localStorage.getItem("wisetrade_demo_user");
        if (demoStored) {
          try {
            setUser(JSON.parse(demoStored));
          } catch {
            setUser(null);
            localStorage.removeItem("wisetrade_demo_user");
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login as Demo Trader
  const loginAsDemo = useCallback(() => {
    const demoUser = {
      uid: "demo-trader-01",
      email: "trader.demo@wisetrade.io",
      displayName: "Elite Trader (Demo)",
      isDemo: true,
    };
    setUser(demoUser);
    localStorage.setItem("wisetrade_demo_user", JSON.stringify(demoUser));
    notify("Logged in to Instant Paper Trading Demo!", "success", "Welcome");
    return demoUser;
  }, [notify]);

  // Logout
  const logout = useCallback(async () => {
    try {
      localStorage.removeItem("wisetrade_demo_user");
      await firebaseSignOut(auth);
    } catch {
      // ignore
    }
    setUser(null);
    notify("Logged out successfully.", "info");
  }, [notify]);

  // Set wallet helper
  const setWallet = useCallback(async (newWallet) => {
    setWalletState(newWallet);
    if (user && !user.isDemo) {
      try {
        await saveUserWallet(user.uid, newWallet);
      } catch (err) {
        console.warn("Save wallet error:", err);
      }
    }
  }, [user]);

  // Reset Demo Account
  const resetDemoAccount = useCallback(() => {
    setWalletState(DEFAULT_WALLET);
    setOrders(INITIAL_SEED_ORDERS);
    setTransactions(INITIAL_SEED_TRANSACTIONS);
    localStorage.setItem("wisetrade_wallet", JSON.stringify(DEFAULT_WALLET));
    localStorage.setItem("wisetrade_orders", JSON.stringify(INITIAL_SEED_ORDERS));
    localStorage.setItem("wisetrade_transactions", JSON.stringify(INITIAL_SEED_TRANSACTIONS));
    notify("Account balances and seed data reset to default 10,000 USDT.", "success", "Reset Completed");
  }, [notify]);

  // Deposit USDT
  const depositUSDT = useCallback(async (amount, network = "TRC20") => {
    const depositAmount = Number(amount);
    if (!Number.isFinite(depositAmount) || depositAmount <= 0) {
      notify("Enter a valid deposit amount.", "error", "Invalid Amount");
      return { success: false, message: "Enter a valid deposit amount." };
    }

    const currentUSDT = Number(wallet?.USDT || 0);
    const currentDeposits = Number(wallet?.totalDeposits || 0);

    const newWallet = {
      ...wallet,
      USDT: +(currentUSDT + depositAmount).toFixed(2),
      totalDeposits: +(currentDeposits + depositAmount).toFixed(2),
    };

    const tx = {
      id: `tx-${Date.now()}`,
      type: "DEPOSIT",
      asset: "USDT",
      amount: depositAmount,
      network,
      txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      status: "COMPLETED",
      createdAt: new Date(),
    };

    setWalletState(newWallet);
    setTransactions((prev) => [tx, ...prev]);

    if (user && !user.isDemo) {
      try {
        await saveUserWallet(user.uid, newWallet);
        await saveWalletTransaction(user.uid, tx);
      } catch (err) {
        console.warn("Firestore save failed:", err);
      }
    }

    notify(`Successfully credited $${depositAmount.toLocaleString()} USDT via ${network}`, "success", "Deposit Successful");
    return { success: true, message: `Successfully deposited $${depositAmount.toFixed(2)}` };
  }, [wallet, user, notify]);

  // Withdraw USDT
  const withdrawUSDT = useCallback(async (amount, address = "", network = "TRC20") => {
    const withdrawAmount = Number(amount);
    if (!Number.isFinite(withdrawAmount) || withdrawAmount <= 0) {
      notify("Enter a valid withdrawal amount.", "error", "Invalid Amount");
      return { success: false, message: "Enter a valid withdrawal amount." };
    }

    const currentUSDT = Number(wallet?.USDT || 0);
    if (withdrawAmount > currentUSDT) {
      notify("Insufficient available USDT balance.", "error", "Withdrawal Failed");
      return { success: false, message: "Insufficient USDT balance." };
    }

    const currentWithdrawals = Number(wallet?.totalWithdrawals || 0);
    const newWallet = {
      ...wallet,
      USDT: +(currentUSDT - withdrawAmount).toFixed(2),
      totalWithdrawals: +(currentWithdrawals + withdrawAmount).toFixed(2),
    };

    const tx = {
      id: `tx-${Date.now()}`,
      type: "WITHDRAW",
      asset: "USDT",
      amount: withdrawAmount,
      destination: address || "External Address",
      network,
      status: "COMPLETED",
      createdAt: new Date(),
    };

    setWalletState(newWallet);
    setTransactions((prev) => [tx, ...prev]);

    if (user && !user.isDemo) {
      try {
        await saveUserWallet(user.uid, newWallet);
        await saveWalletTransaction(user.uid, tx);
      } catch (err) {
        console.warn("Firestore save failed:", err);
      }
    }

    notify(`Successfully processed withdrawal of $${withdrawAmount.toLocaleString()} USDT`, "success", "Withdrawal Completed");
    return { success: true, message: `Successfully withdrew $${withdrawAmount.toFixed(2)}` };
  }, [wallet, user, notify]);

  // Instant Buy Asset
  const buyAsset = useCallback(async (symbol, amount, price) => {
    const asset = symbol.replace("USDT", "");
    const quantity = Number(amount);
    const assetPrice = Number(price);
    const subtotal = quantity * assetPrice;
    const fee = +(subtotal * 0.001).toFixed(2); // 0.1% fee
    const total = subtotal + fee;

    if (quantity <= 0 || assetPrice <= 0) {
      notify("Invalid order quantity or price.", "error", "Order Rejected");
      return { success: false, message: "Invalid quantity or price." };
    }

    const usdtBalance = Number(wallet?.USDT || 0);
    if (total > usdtBalance) {
      notify(`Insufficient USDT balance. Needed $${total.toFixed(2)}, Available: $${usdtBalance.toFixed(2)}`, "error", "Insufficient Balance");
      return { success: false, message: "Insufficient USDT balance." };
    }

    const currentAssetBalance = Number(wallet?.[asset] || 0);
    const newWallet = {
      ...wallet,
      USDT: +(usdtBalance - total).toFixed(2),
      [asset]: +(currentAssetBalance + quantity).toFixed(6),
    };

    const order = {
      id: `ord-${Date.now()}`,
      side: "BUY",
      symbol: `${asset}/USDT`,
      asset,
      amount: quantity,
      price: assetPrice,
      fee,
      total: +total.toFixed(2),
      status: "COMPLETED",
      createdAt: new Date(),
    };

    setWalletState(newWallet);
    setOrders((prev) => [order, ...prev]);

    if (user && !user.isDemo) {
      try {
        await saveUserWallet(user.uid, newWallet);
        await saveOrder(user.uid, order);
      } catch (err) {
        console.warn("Firestore save failed:", err);
      }
    }

    notify(`Bought ${quantity} ${asset} at $${assetPrice.toLocaleString()}`, "success", "Order Filled");
    return { success: true, message: `Bought ${quantity} ${asset} successfully.` };
  }, [wallet, user, notify]);

  // Instant Sell Asset
  const sellAsset = useCallback(async (symbol, amount, price) => {
    const asset = symbol.replace("USDT", "");
    const quantity = Number(amount);
    const assetPrice = Number(price);
    const subtotal = quantity * assetPrice;
    const fee = +(subtotal * 0.001).toFixed(2);
    const total = subtotal - fee;

    if (quantity <= 0 || assetPrice <= 0) {
      notify("Invalid order quantity or price.", "error", "Order Rejected");
      return { success: false, message: "Invalid quantity or price." };
    }

    const currentAssetBalance = Number(wallet?.[asset] || 0);
    if (quantity > currentAssetBalance) {
      notify(`Insufficient ${asset} balance. You have ${currentAssetBalance.toFixed(6)} ${asset}`, "error", "Insufficient Balance");
      return { success: false, message: `Insufficient ${asset} balance.` };
    }

    const usdtBalance = Number(wallet?.USDT || 0);
    const newWallet = {
      ...wallet,
      [asset]: +(currentAssetBalance - quantity).toFixed(6),
      USDT: +(usdtBalance + total).toFixed(2),
    };

    const order = {
      id: `ord-${Date.now()}`,
      side: "SELL",
      symbol: `${asset}/USDT`,
      asset,
      amount: quantity,
      price: assetPrice,
      fee,
      total: +total.toFixed(2),
      status: "COMPLETED",
      createdAt: new Date(),
    };

    setWalletState(newWallet);
    setOrders((prev) => [order, ...prev]);

    if (user && !user.isDemo) {
      try {
        await saveUserWallet(user.uid, newWallet);
        await saveOrder(user.uid, order);
      } catch (err) {
        console.warn("Firestore save failed:", err);
      }
    }

    notify(`Sold ${quantity} ${asset} for $${total.toLocaleString()} USDT`, "success", "Order Filled");
    return { success: true, message: `Sold ${quantity} ${asset} successfully.` };
  }, [wallet, user, notify]);

  // Cancel order
  const cancelOrder = useCallback((orderId) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: "CANCELLED" } : ord))
    );
    notify("Order has been cancelled.", "info", "Order Cancelled");
  }, [notify]);

  return (
    <TradingContext.Provider
      value={{
        user,
        wallet,
        setWallet,
        orders,
        setOrders,
        transactions,
        setTransactions,
        depositUSDT,
        withdrawUSDT,
        buyAsset,
        sellAsset,
        cancelOrder,
        resetDemoAccount,
        loginAsDemo,
        logout,
        loading,
        selectedSymbol,
        setSelectedSymbol,
        notify,
      }}
    >
      {children}

      {/* Floating Global Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => dismissToast(toast.id)}
            className={`pointer-events-auto cursor-pointer rounded-xl border p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-right-5 ${
              toast.type === "success"
                ? "bg-slate-900/95 border-[#0ecb81]/50 text-white"
                : toast.type === "error"
                ? "bg-slate-900/95 border-[#f6465d]/50 text-white"
                : "bg-slate-900/95 border-[#F0B90B]/50 text-white"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">
                {toast.type === "success" ? "✅" : toast.type === "error" ? "⚠️" : "ℹ️"}
              </span>
              <div className="flex-1">
                {toast.title && <p className="font-semibold text-sm mb-0.5">{toast.title}</p>}
                <p className="text-xs text-slate-300 leading-relaxed">{toast.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </TradingContext.Provider>
  );
}

export function useTrading() {
  return useContext(TradingContext);
}
