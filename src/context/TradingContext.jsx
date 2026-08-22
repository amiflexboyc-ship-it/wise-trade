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
} from "../Services/firestoreService";

const TradingContext = createContext();

const defaultWallet = {
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

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedSymbol, setSelectedSymbol] =
    useState("BTCUSDT");

  // AUTH + LOAD DATA

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {
          setUser(currentUser);

          if (!currentUser) {
            setWalletState(defaultWallet);
            setOrders([]);
            setLoading(false);
            return;
          }

          try {
            const userWallet =
              await getUserWallet(
                currentUser.uid
              );

            const userOrders =
              await getUserOrders(
                currentUser.uid
              );

            setWalletState(
              userWallet || defaultWallet
            );

            setOrders(
              userOrders || []
            );
          } catch (error) {
            console.error(
              "Error loading wallet/orders:",
              error
            );

            setWalletState(
              defaultWallet
            );

            setOrders([]);
          } finally {
            setLoading(false);
          }
        }
      );

    return () => unsubscribe();
  }, []);

  // SAVE WALLET

  const setWallet = async (
    newWallet
  ) => {
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

  // BUY ASSET

  const buyAsset = async (
    symbol,
    amount,
    price
  ) => {
    if (!user) {
      return {
        success: false,
        message:
          "You must be logged in.",
      };
    }

    const asset =
      symbol.replace("USDT", "");

    const quantity =
      Number(amount);

    const assetPrice =
      Number(price);

    const total =
      quantity * assetPrice;

    // Validate asset
    const supportedAssets = [
      "BTC",
      "ETH",
      "BNB",
      "SOL",
    ];

    if (
      !supportedAssets.includes(asset)
    ) {
      return {
        success: false,
        message:
          "Unsupported trading asset.",
      };
    }

    if (quantity <= 0) {
      return {
        success: false,
        message:
          "Invalid amount.",
      };
    }

    if (assetPrice <= 0) {
      return {
        success: false,
        message:
          "Invalid market price.",
      };
    }

    // Check USDT
    if (
      total >
      Number(wallet?.USDT || 0)
    ) {
      return {
        success: false,
        message:
          "Insufficient USDT balance.",
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
      // Save wallet
      await saveUserWallet(
        user.uid,
        newWallet
      );

      // Create order
      const order = {
        side: "BUY",
        symbol: `${asset}/USDT`,
        asset: asset,
        amount: quantity,
        price: assetPrice,
        total: total,
      };

      // Save order
      await saveOrder(
        user.uid,
        order
      );

      // Update UI
      setWalletState(
        newWallet
      );

      setOrders(
        (previousOrders) => [
          {
            ...order,
            id: Date.now().toString(),
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
        "BUY ASSET error:",
        error
      );

      return {
        success: false,
        message:
          "Failed to complete purchase.",
      };
    }
  };

  // SELL ASSET

  const sellAsset = async (
    symbol,
    amount,
    price
  ) => {
    if (!user) {
      return {
        success: false,
        message:
          "You must be logged in.",
      };
    }

    const asset =
      symbol.replace("USDT", "");

    const quantity =
      Number(amount);

    const assetPrice =
      Number(price);

    const total =
      quantity * assetPrice;

    const supportedAssets = [
      "BTC",
      "ETH",
      "BNB",
      "SOL",
    ];

    if (
      !supportedAssets.includes(asset)
    ) {
      return {
        success: false,
        message:
          "Unsupported trading asset.",
      };
    }

    if (quantity <= 0) {
      return {
        success: false,
        message:
          "Invalid amount.",
      };
    }

    if (assetPrice <= 0) {
      return {
        success: false,
        message:
          "Invalid market price.",
      };
    }

    // Check asset balance
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
      // Save wallet
      await saveUserWallet(
        user.uid,
        newWallet
      );

      // Create order
      const order = {
        side: "SELL",
        symbol: `${asset}/USDT`,
        asset: asset,
        amount: quantity,
        price: assetPrice,
        total: total,
      };

      // Save order
      const orderId = await saveOrder(
        user.uid,
        order
      );

      setWalletState(newWallet);

      setOrders((previousOrders) => [
        {
          ...order,
          id: orderId,
          createdAt: new Date(),
        },
        ...previousOrders,
      ]);

      return {
        success: true,
        message:
          `Sold ${quantity} ${asset} successfully.`,
      };
    } catch (error) {
      console.error(
        "SELL ASSET error:",
        error
      );

      return {
        success: false,
        message:
          "Failed to complete sale.",
      };
    }
  };

  // PROVIDER

  return (
    <TradingContext.Provider
      value={{
        user,
        wallet,
        setWallet,

        orders,
        setOrders,

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

// USE TRADING

export function useTrading() {
  return useContext(
    TradingContext
  );
}