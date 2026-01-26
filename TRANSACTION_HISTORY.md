# 📊 Система сохранения истории транзакций

## 🎯 Как это работает

Приложение использует **комбинированный подход** для сохранения и управления историей транзакций:

### Архитектура

```
┌─────────────────────────────────────────────────────┐
│            TRANSACTION HISTORY SYSTEM                │
└─────────────────────────────────────────────────────┘
         ↓
    ┌────────────────────────────────────────┐
    │  1. ETHERSCAN API (Real blockchain)    │
    │     - getTokenTransfers()              │
    │     - Получает реальные транзакции     │
    └────────────────────────────────────────┘
         ↓ (Server Action)
    ┌────────────────────────────────────────┐
    │  2. SERVER-SIDE CACHE (1 minute)       │
    │     - getTransactionHistory()          │
    │     - Кеширует 300 секунд              │
    │     - Cache Key: publicKey:transactions│
    └────────────────────────────────────────┘
         ↓ (JSON Response)
    ┌────────────────────────────────────────┐
    │  3. BROWSER LOCALSTORAGE (Persistent)  │
    │     - saveTransaction()                │
    │     - 100 последних транзакций         │
    │     - Кеш: 5 минут                     │
    └────────────────────────────────────────┘
         ↓
    ┌────────────────────────────────────────┐
    │  4. UI COMPONENT (Real-time display)   │
    │     - TransactionHistory.tsx           │
    │     - Статистика и список              │
    └────────────────────────────────────────┘
```

## 📁 Структура файлов

### 1. **Server Action** - `actions/transactions.actions.ts`

```typescript
export async function getTransactionHistory(
  publicKey: string,
  tokenAddress?: string,
): Promise<Transaction[]>;
```

**Что делает:**

- Запрашивает транзакции с EtherScan API
- Кеширует результат на 5 минут (300 секунд)
- Возвращает последние 10 транзакций
- Преобразует данные в нужный формат

**Кеширование:**

```typescript
withCache(`${publicKey}:transactions`, 300_000, async () => {
  // Fetch from EtherScan
});
```

### 2. **localStorage Утилиты** - `lib/localStorage.ts`

**Функции:**

| Функция                     | Описание                    | Что хранит                     |
| --------------------------- | --------------------------- | ------------------------------ |
| `saveTransaction(tx)`       | Сохраняет одну транзакцию   | hash, value, timestamp, status |
| `getStoredTransactions()`   | Получает все сохранённые    | Array<LocalTransaction>        |
| `shouldRefreshCache()`      | Проверяет нужно ли обновить | TTL 5 минут                    |
| `updateTransactionStatus()` | Обновляет статус транзакции | pending→completed→failed       |
| `getFilteredTransactions()` | Фильтрует по типу/статусу   | in\|out, completed\|pending    |
| `getTransactionStats()`     | Статистика                  | incoming, outgoing, total      |
| `clearTransactionHistory()` | Очищает всю историю         | null                           |

### 3. **UI Component** - `components/TransactionHistory.tsx`

**Логика:**

```typescript
// 1. При монтировании
→ Загруженить из localStorage (быстро, offline)
→ Показать пользователю

// 2. Если кеш устарел (> 5 минут)
→ Запросить с сервера (getTransactionHistory)
→ Получить реальные данные с EtherScan
→ Сохранить в localStorage
→ Обновить UI

// 3. Постоянное обновление
→ Автоматическое сохранение при Deposit/Withdraw
→ Отслеживание статуса (pending → completed)
```

## 💾 Поток данных

### При загрузке страницы:

```
User opens App
    ↓
useEffect → getStoredTransactions() (localStorage)
    ↓
setTransactions(stored) // Показываем сразу
    ↓
if (shouldRefreshCache()) // Если кеш старый?
    ↓
startTransition(() => getTransactionHistory(publicKey))
    ↓
Server → EtherScan API → Parse → Return
    ↓
saveTransaction() → localStorage
    ↓
setTransactions(new) // Обновляем UI
```

### При Deposit/Withdraw:

```
User clicks "Deposit"
    ↓
handleDeposit() ServerAction
    ↓
Block explorer detects transaction
    ↓
Transaction gets hash + timestamp
    ↓
saveTransaction(newTx) → localStorage
    ↓
toast.success("Deposit successful")
    ↓
Auto-refresh на следующее время
```

## 🔒 Сохраняемые данные

### LocalTransaction interface

```typescript
interface LocalTransaction {
  id: string; // Уникальный ID (hash)
  hash: string; // TX hash
  from: string; // Адрес отправителя
  to: string; // Адрес получателя
  value: string; // Сумма (0.5 WETH)
  timestamp: number; // Unix timestamp
  type: "in" | "out" | "pending"; // Тип транзакции
  description?: string; // Custom описание
  status: "completed" | "pending" | "failed"; // Статус
}
```

### Пример сохранённого объекта:

```json
{
  "id": "0x1234567890abcdef...",
  "hash": "0x1234567890abcdef...",
  "from": "0x742d35cc6634c0532925a3b844bc9e7595f42be0",
  "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  "value": "0.5000",
  "timestamp": 1704009600000,
  "type": "out",
  "description": "Sent 0.5 WETH",
  "status": "completed"
}
```

## 📊 Статистика

Компонент автоматически вычисляет:

```typescript
{
  total: 15,           // Всего транзакций
  incoming: 8,         // Входящих
  outgoing: 7,         // Исходящих
  pending: 1,          // На обработке
  completed: 14,       // Завершённых
  failed: 0,           // Ошибок
  totalInValue: 5.25,  // Сумма входящих
  totalOutValue: 3.75, // Сумма исходящих
}
```

## 🎯 Как использовать

### Сохранить новую транзакцию:

```typescript
import { saveTransaction } from "@/lib/localStorage";

saveTransaction({
  id: "0xabc123",
  hash: "0xabc123",
  from: publicKey,
  to: tokenAddress,
  value: "0.5",
  timestamp: Date.now(),
  type: "out",
  status: "pending",
  description: "Deposit 0.5 WETH",
});
```

### Получить все сохранённые транзакции:

```typescript
import { getStoredTransactions } from "@/lib/localStorage";

const txs = getStoredTransactions();
console.log(txs); // LocalTransaction[]
```

### Обновить статус:

```typescript
import { updateTransactionStatus } from "@/lib/localStorage";

updateTransactionStatus("0xabc123", "completed");
```

### Получить статистику:

```typescript
import { getTransactionStats } from "@/lib/localStorage";

const stats = getTransactionStats();
console.log(stats.totalInValue); // 5.25
```

### Очистить историю:

```typescript
import { clearTransactionHistory } from "@/lib/localStorage";

clearTransactionHistory(); // Удалит все из localStorage
```

## ⚙️ Настройка

### Изменить время кеша (5 минут):

```typescript
// lib/localStorage.ts
const CACHE_DURATION = 10 * 60 * 1000; // 10 минут
```

### Изменить лимит сохраняемых транзакций (100):

```typescript
// lib/localStorage.ts
localStorage.setItem(
  TRANSACTIONS_STORAGE_KEY,
  JSON.stringify(transactions.slice(0, 50)), // 50 вместо 100
);
```

### Изменить TTL сервера (5 минут):

```typescript
// actions/transactions.actions.ts
return withCache(`${publicKey}:transactions`, 600_000, async () => {
  // 600_000 мс = 10 минут
});
```

## 🚀 Производительность

### Оптимизация:

- ✅ **localStorage** - быстрый локальный доступ
- ✅ **Server Cache** - минимум API запросов
- ✅ **Lazy Loading** - показываем cached data первой
- ✅ **Pagination** - только первые 10 показываются
- ✅ **Debouncing** - обновление max 1 раз в 5 минут

### Размер данных:

- JSON транзакции: ~300 байт
- 100 транзакций: ~30 KB
- localStorage лимит: обычно 5-10 MB ✅

## 🔄 Обновление в реальном времени

Для real-time обновления можно добавить:

```typescript
// WebSocket слушатель (optional)
useEffect(() => {
  const ws = new WebSocket("wss://...");

  ws.onmessage = (event) => {
    const newTx = JSON.parse(event.data);
    saveTransaction(newTx);
    setTransactions((prev) => [newTx, ...prev]);
  };

  return () => ws.close();
}, []);
```

## 📝 Лучшие практики

1. ✅ **Всегда проверяйте** перед сохранением:

   ```typescript
   if (!stored.find((s) => s.hash === tx.hash)) {
     saveTransaction(tx);
   }
   ```

2. ✅ **Обновляйте статус** при изменении:

   ```typescript
   updateTransactionStatus(hash, "completed");
   ```

3. ✅ **Используйте фильтры** для отчётов:

   ```typescript
   const incoming = getFilteredTransactions("in");
   const failed = getFilteredTransactions(undefined, "failed");
   ```

4. ✅ **Периодически очищайте** старые данные:
   ```typescript
   // Удалять транзакции старше 30 дней
   ```

## 🎓 Примеры

### Пример 1: Отправить WETH и сохранить

```typescript
const handleDeposit = async () => {
  const hash = await sendTransaction();

  saveTransaction({
    id: hash,
    hash: hash,
    from: publicKey,
    to: tokenAddress,
    value: amount,
    timestamp: Date.now(),
    type: "out",
    status: "pending",
    description: `Deposit ${amount} WETH`,
  });

  // Позже обновим статус
  setTimeout(() => {
    updateTransactionStatus(hash, "completed");
  }, 5000);
};
```

### Пример 2: Получить статистику за месяц

```typescript
const getMonthlyStats = () => {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const monthly = getStoredTransactions().filter(
    (tx) => tx.timestamp > thirtyDaysAgo,
  );

  return {
    count: monthly.length,
    inValue: monthly
      .filter((tx) => tx.type === "in")
      .reduce((sum, tx) => sum + parseFloat(tx.value), 0),
  };
};
```

---

**История транзакций полностью управляется и сохраняется!** ✅
