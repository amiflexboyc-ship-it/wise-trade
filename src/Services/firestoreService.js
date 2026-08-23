import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase";

// GET USER WALLET
export async function getUserWallet(userId) {
  const walletRef = doc(
    db,
    "wallets",
    userId
  );

  const walletSnap = await getDoc(
    walletRef
  );

  if (walletSnap.exists()) {
    return walletSnap.data();
  }

  const newWallet = {
    initialBalance: 10000,
    USDT: 10000,
    BTC: 0,
    ETH: 0,
    BNB: 0,
    SOL: 0,
  };

  await setDoc(
    walletRef,
    newWallet
  );

  return newWallet;
}

// SAVE USER WALLET
export async function saveUserWallet(
  userId,
  wallet
) {
  const walletRef = doc(
    db,
    "wallets",
    userId
  );

  await setDoc(
    walletRef,
    wallet
  );
}

// SAVE ORDER
export async function saveOrder(
  userId,
  order
) {
  const ordersRef = collection(
    db,
    "users",
    userId,
    "orders"
  );

  const orderRef = await addDoc(
    ordersRef,
    {
      ...order,
      createdAt: serverTimestamp(),
    }
  );

  return orderRef.id;
}

// GET USER ORDERS
export async function getUserOrders(
  userId
) {
  const ordersRef = collection(
    db,
    "users",
    userId,
    "orders"
  );

  const ordersQuery = query(
    ordersRef,
    orderBy(
      "createdAt",
      "desc"
    )
  );

  const ordersSnapshot =
    await getDocs(
      ordersQuery
    );

  return ordersSnapshot.docs.map(
    (orderDoc) => {
      const data =
        orderDoc.data();

      return {
        id: orderDoc.id,
        ...data,

        createdAt:
          data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date(),
      };
    }
  );
}