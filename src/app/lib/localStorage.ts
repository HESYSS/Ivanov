// Утилиты для работы с localStorage и кешированием транзакций

const TRANSACTIONS_STORAGE_KEY = "defi_transactions";
const STORAGE_EXPIRY_KEY = "defi_transactions_expiry";
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

export interface LocalTransaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  type: "in" | "out" | "pending";
  description?: string;
  status: "completed" | "pending" | "failed";
}

/**
 * Сохранить транзакцию в localStorage
 */
export function saveTransaction(tx: LocalTransaction): void {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    const transactions: LocalTransaction[] = stored ? JSON.parse(stored) : [];

    // Проверяем что такой хеш ещё не добавлен
    if (!transactions.find((t) => t.hash === tx.hash)) {
      transactions.unshift(tx); // Добавляем в начало
      // Ограничиваем до 100 последних транзакций
      localStorage.setItem(
        TRANSACTIONS_STORAGE_KEY,
        JSON.stringify(transactions.slice(0, 100)),
      );
    }

    // Обновляем время кеша
    localStorage.setItem(STORAGE_EXPIRY_KEY, Date.now().toString());
  } catch (e) {
    console.error("[localStorage] Save transaction failed:", e);
  }
}

/**
 * Получить все транзакции из localStorage
 */
export function getStoredTransactions(): LocalTransaction[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("[localStorage] Get transactions failed:", e);
    return [];
  }
}

/**
 * Очистить историю транзакций
 */
export function clearTransactionHistory(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(TRANSACTIONS_STORAGE_KEY);
    localStorage.removeItem(STORAGE_EXPIRY_KEY);
  } catch (e) {
    console.error("[localStorage] Clear failed:", e);
  }
}

/**
 * Проверить нужно ли обновить кеш
 */
export function shouldRefreshCache(): boolean {
  if (typeof window === "undefined") return true;

  try {
    const expiry = localStorage.getItem(STORAGE_EXPIRY_KEY);
    if (!expiry) return true;

    const expiryTime = Number(expiry);
    const now = Date.now();
    return now - expiryTime > CACHE_DURATION;
  } catch (e) {
    return true;
  }
}

/**
 * Обновить статус транзакции
 */
export function updateTransactionStatus(
  hash: string,
  status: "completed" | "pending" | "failed",
): void {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    const transactions: LocalTransaction[] = stored ? JSON.parse(stored) : [];

    const tx = transactions.find((t) => t.hash === hash);
    if (tx) {
      tx.status = status;
      localStorage.setItem(
        TRANSACTIONS_STORAGE_KEY,
        JSON.stringify(transactions),
      );
    }
  } catch (e) {
    console.error("[localStorage] Update status failed:", e);
  }
}

/**
 * Получить историю с фильтром
 */
export function getFilteredTransactions(
  type?: "in" | "out",
  status?: "completed" | "pending" | "failed",
): LocalTransaction[] {
  const all = getStoredTransactions();

  return all.filter((tx) => {
    if (type && tx.type !== type) return false;
    if (status && tx.status !== status) return false;
    return true;
  });
}

/**
 * Получить статистику транзакций
 */
export function getTransactionStats() {
  const transactions = getStoredTransactions();

  return {
    total: transactions.length,
    incoming: transactions.filter((t) => t.type === "in").length,
    outgoing: transactions.filter((t) => t.type === "out").length,
    pending: transactions.filter((t) => t.status === "pending").length,
    completed: transactions.filter((t) => t.status === "completed").length,
    failed: transactions.filter((t) => t.status === "failed").length,
    totalInValue: transactions
      .filter((t) => t.type === "in" && t.status === "completed")
      .reduce((sum, t) => sum + parseFloat(t.value), 0),
    totalOutValue: transactions
      .filter((t) => t.type === "out" && t.status === "completed")
      .reduce((sum, t) => sum + parseFloat(t.value), 0),
  };
}
