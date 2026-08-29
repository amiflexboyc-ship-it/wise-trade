
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { onAuthStateChanged } from "firebase/auth";
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

const defaultWallet = {
  initialBalance: 10000,
  totalDeposits: 0,
  totalWithdrawals: 0,
  USDT: 10000,
  BTC: 0,
  ETH: 0,
  BNB: 0,
  SOL: 0,
};

export function TradingProvider({ children }) {
  const [user, setUser] = useState(null);

  const [wallet, setWalletState] =
    useState(defaultWallet);

  const [orders, setOrders] =
    useState([]);

  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedSymbol, setSelectedSymbol] =
    useState("BTCUSDT");

  // ==========================================
  // AUTH + LOAD DATA
  // ==========================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);

        if (!currentUser) {
          setWalletState(defaultWallet);
          setOrders([]);
          setTransactions([]);
          setLoading(false);
          return;
        }

        setLoading(true);

        try {
          const userWallet =
            await getUserWallet(
              currentUser.uid
            );

          const userOrders =
            await getUserOrders(
              currentUser.uid
            );

          const userTransactions =
            await getWalletTransactions(
              currentUser.uid
            );

          const updatedWallet = {
            ...defaultWallet,
            ...userWallet,

            initialBalance:
              Number(
                userWallet?.initialBalance ?? 10000
              ),

            totalDeposits:
              Number(
                userWallet?.totalDeposits ?? 0
              ),

            totalWithdrawals:
              Number(
                userWallet?.totalWithdrawals ?? 0
              ),
          };

          setWalletState(
            updatedWallet
          );

          setOrders(
            userOrders || []
          );

          setTransactions(
            userTransactions || []
          );
        } catch (error) {
          console.error(
            "Error loading trading data:",
            error
          );

          setWalletState(defaultWallet);
          setOrders([]);
          setTransactions([]);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // ==========================================
  // SAVE WALLET
  // ==========================================

  const setWallet = async (newWallet) => {
    setWalletState(newWallet);

    if (!user) return;

    try {
      await saveUserWallet(
        user.uid,
        newWallet
      );
    } catch (error) {
      console.error(
        "Error saving wallet:",
        error
      );
    }
  };

  // ==========================================
  // DEPOSIT
  // ==========================================

  const depositUSDT = async (amount) => {
    if (!user) {
      return {
        success: false,
        message: "You must be logged in.",
      };
    }

    const depositAmount = Number(amount);

    if (
      !Number.isFinite(depositAmount) ||
      depositAmount <= 0
    ) {
      return {
        success: false,
        message: "Enter a valid deposit amount.",
      };
    }

    const currentUSDT =
      Number(wallet?.USDT || 0);

    const currentDeposits =
      Number(wallet?.totalDeposits || 0);

    const newWallet = {
      ...wallet,

      USDT:
        currentUSDT + depositAmount,

      totalDeposits:
        currentDeposits + depositAmount,
    };

    try {
      await saveUserWallet(
        user.uid,
        newWallet
      );

      const transaction = {
        type: "DEPOSIT",
        asset: "USDT",
        amount: depositAmount,
        status: "COMPLETED",
      };

      const transactionId =
        await saveWalletTransaction(
          user.uid,
          transaction
        );

      setWalletState(newWallet);

      setTransactions(
        (previousTransactions) => [
          {
            ...transaction,
            id: transactionId,
            createdAt: new Date(),
          },
          ...previousTransactions,
        ]
      );

      return {
        success: true,
        message:
          `Successfully deposited $${depositAmount.toFixed(
            2
          )}`,
      };
    } catch (error) {
      console.error(
        "Deposit error:",
        error
      );

      return {
        success: false,
        message: "Failed to complete deposit.",
      };
    }
  };

  // ==========================================
  // WITHDRAW
  // ==========================================

  const withdrawUSDT = async (amount) => {
    if (!user) {
      return {
        success: false,
        message: "You must be logged in.",
      };
    }

    const withdrawAmount = Number(amount);

    if (
      !Number.isFinite(withdrawAmount) ||
      withdrawAmount <= 0
    ) {
      return {
        success: false,
        message:
          "Enter a valid withdrawal amount.",
      };
    }

    const currentUSDT =
      Number(wallet?.USDT || 0);

    if (withdrawAmount > currentUSDT) {
      return {
        success: false,
        message: "Insufficient USDT balance.",
      };
    }

    const currentWithdrawals =
      Number(
        wallet?.totalWithdrawals || 0
      );

    const newWallet = {
      ...wallet,

      USDT:
        currentUSDT - withdrawAmount,

      totalWithdrawals:
        currentWithdrawals +
        withdrawAmount,
    };

    try {
      await saveUserWallet(
        user.uid,
        newWallet
      );

      const transaction = {
        type: "WITHDRAW",
        asset: "USDT",
        amount: withdrawAmount,
        status: "COMPLETED",
      };

      const transactionId =
        await saveWalletTransaction(
          user.uid,
          transaction
        );

      setWalletState(newWallet);

      setTransactions(
        (previousTransactions) => [
          {
            ...transaction,
            id: transactionId,
            createdAt: new Date(),
          },
          ...previousTransactions,
        ]
      );

      return {
        success: true,
        message:
          `Successfully withdrew $${withdrawAmount.toFixed(
            2
          )}`,
      };
    } catch (error) {
      console.error(
        "Withdraw error:",
        error
      );

      return {
        success: false,
        message:
          "Failed to complete withdrawal.",
      };
    }
  };

  // ==========================================
  // BUY
  // ==========================================

  const buyAsset = async (
    symbol,
    amount,
    price
  ) => {
    if (!user) {
      return {
        success: false,
        message: "You must be logged in.",
      };
    }

    const asset =
      symbol.replace("USDT", "");

    const quantity = Number(amount);
    const assetPrice = Number(price);
    const total = quantity * assetPrice;

    const supportedAssets = [
      "BTC",
      "ETH",
      "BNB",
      "SOL",
    ];

    if (!supportedAssets.includes(asset)) {
      return {
        success: false,
        message: "Unsupported trading asset.",
      };
    }

    if (quantity <= 0) {
      return {
        success: false,
        message: "Invalid amount.",
      };
    }

    if (assetPrice <= 0) {
      return {
        success: false,
        message: "Invalid market price.",
      };
    }

    if (
      total >
      Number(wallet?.USDT || 0)
    ) {
      return {
        success: false,
        message: "Insufficient USDT balance.",
      };
    }

    const newWallet = {
      ...wallet,

      USDT:
        Number(wallet?.USDT || 0) -
        total,

      [asset]:
        Number(wallet?.[asset] || 0) +
        quantity,
    };

    try {
      await saveUserWallet(
        user.uid,
        newWallet
      );

      const order = {
        side: "BUY",
        symbol: `${asset}/USDT`,
        asset,
        amount: quantity,
        price: assetPrice,
        total,
        status: "COMPLETED",
      };

      const orderId =
        await saveOrder(
          user.uid,
          order
        );

      setWalletState(newWallet);

      setOrders(
        (previousOrders) => [
          {
            ...order,
            id: orderId,
            createdAt: new Date(),
          },
          ...previousOrders,
        ]
      );

      return {
        success: true,
        message:
          `Bought ${quantity} ${asset} successfully.`,
      };
    } catch (error) {
      console.error(
        "Buy error:",
        error
      );

      return {
        success: false,
        message:
          "Failed to complete purchase.",
      };
    }
  };

  // ==========================================
  // SELL
  // ==========================================

  const sellAsset = async (
    symbol,
    amount,
    price
  ) => {
    if (!user) {
      return {
        success: false,
        message: "You must be logged in.",
      };
    }

    const asset =
      symbol.replace("USDT", "");

    const quantity = Number(amount);
    const assetPrice = Number(price);
    const total = quantity * assetPrice;

    const supportedAssets = [
      "BTC",
      "ETH",
      "BNB",
      "SOL",
    ];

    if (!supportedAssets.includes(asset)) {
      return {
        success: false,
        message: "Unsupported trading asset.",
      };
    }

    if (quantity <= 0) {
      return {
        success: false,
        message: "Invalid amount.",
      };
    }

    if (assetPrice <= 0) {
      return {
        success: false,
        message: "Invalid market price.",
      };
    }

    if (
      quantity >
      Number(wallet?.[asset] || 0)
    ) {
      return {
        success: false,
        message:
          `Insufficient ${asset} balance.`,
      };
    }

    const newWallet = {
      ...wallet,

      [asset]:
        Number(wallet?.[asset] || 0) -
        quantity,

      USDT:
        Number(wallet?.USDT || 0) +
        total,
    };

    try {
      await saveUserWallet(
        user.uid,
        newWallet
      );

      const order = {
        side: "SELL",
        symbol: `${asset}/USDT`,
        asset,
        amount: quantity,
        price: assetPrice,
        total,
        status: "COMPLETED",
      };

      const orderId =
        await saveOrder(
          user.uid,
          order
        );

      setWalletState(newWallet);

      setOrders(
        (previousOrders) => [
          {
            ...order,
            id: orderId,
            createdAt: new Date(),
          },
          ...previousOrders,
        ]
      );

      return {
        success: true,
        message:
          `Sold ${quantity} ${asset} successfully.`,
      };
    } catch (error) {
      console.error(
        "Sell error:",
        error
      );

      return {
        success: false,
        message:
          "Failed to complete sale.",
      };
    }
  };

  // ==========================================
  // PROVIDER
  // ==========================================

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

        loading,

        selectedSymbol,
        setSelectedSymbol,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
}

// ==========================================
// USE TRADING
// ==========================================

export function useTrading() {
  return useContext(TradingContext);
}

