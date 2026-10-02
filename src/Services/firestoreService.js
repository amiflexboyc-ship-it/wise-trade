
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  collectionGroup,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase";

// ==========================================
// GET USER WALLET
// ==========================================

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
    totalDeposits: 0,
    totalWithdrawals: 0,

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

// ==========================================
// SAVE USER WALLET
// ==========================================

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
    wallet,
    {
      merge: true,
    }
  );
}

// ==========================================
// SAVE ORDER
// ==========================================

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

// ==========================================
// GET USER ORDERS
// ==========================================

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
            : null,
      };
    }
  );
}


// ==========================================
// SAVE SUPPORT TICKET
// ==========================================

export async function saveSupportTicket(
  userId,
  ticket
) {
  const ticketsRef = collection(
    db,
    "users",
    userId,
    "supportTickets"
  );

  const ticketRef = await addDoc(
    ticketsRef,
    {
      ...ticket,
      userId,
      status: ticket.status || "open",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return ticketRef.id;
}


// ==========================================
// SAVE WALLET TRANSACTION
// ==========================================

export async function saveWalletTransaction(
  userId,
  transaction
) {
  const transactionsRef =
    collection(
      db,
      "users",
      userId,
      "transactions"
    );

  const transactionRef =
    await addDoc(
      transactionsRef,
      {
        ...transaction,
        createdAt:
          serverTimestamp(),
      }
    );

  return transactionRef.id;
}

// ==========================================
// GET WALLET TRANSACTIONS
// ==========================================

export async function getWalletTransactions(
  userId
) {
  const transactionsRef =
    collection(
      db,
      "users",
      userId,
      "transactions"
    );

  const transactionsQuery =
    query(
      transactionsRef,
      orderBy(
        "createdAt",
        "desc"
      )
    );

  const transactionsSnapshot =
    await getDocs(
      transactionsQuery
    );

  return transactionsSnapshot.docs.map(
    (transactionDoc) => {
      const data =
        transactionDoc.data();

      return {
        id: transactionDoc.id,
        ...data,

        createdAt:
          data.createdAt?.toDate
            ? data.createdAt.toDate()
            : null,
      };
    }
  );
}


// ADMIN UPDATE SUPPORT TICKET
export async function updateSupportTicket(
  ticketUserId,
  ticketId,
  updates
) {
  const ticketRef = doc(
    db,
    "users",
    ticketUserId,
    "supportTickets",
    ticketId
  );

  await updateDoc(ticketRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}
// ==========================================
// GET USER SUPPORT TICKETS
// ==========================================

export async function getSupportTickets(
  userId
) {
  const ticketsRef = collection(
    db,
    "users",
    userId,
    "supportTickets"
  );

  const ticketsQuery = query(
    ticketsRef,
    orderBy(
      "createdAt",
      "desc"
    )
  );

  const ticketsSnapshot =
    await getDocs(
      ticketsQuery
    );

  return ticketsSnapshot.docs.map(
    (ticketDoc) => {
      const data =
        ticketDoc.data();

      return {
        id: ticketDoc.id,
        ...data,

        createdAt:
          data.createdAt?.toDate
            ? data.createdAt.toDate()
            : null,

        updatedAt:
          data.updatedAt?.toDate
            ? data.updatedAt.toDate()
            : null,
      };
    }
  );
}

// GET ALL SUPPORT TICKETS - ADMIN
export async function getAllSupportTickets() {
  const ticketsQuery = query(
    collectionGroup(db, "supportTickets")
  );

  const ticketsSnapshot = await getDocs(ticketsQuery);

  const tickets = ticketsSnapshot.docs.map((ticketDoc) => {
    const data = ticketDoc.data();

    return {
      id: ticketDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate()
        : null,
      updatedAt: data.updatedAt?.toDate
        ? data.updatedAt.toDate()
        : null,
      userId: ticketDoc.ref.parent.parent?.id || null,
    };
  });

  // Sort newest tickets first
  tickets.sort((a, b) => {
    if (!a.createdAt) return 1;
    if (!b.createdAt) return -1;

    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return tickets;
}