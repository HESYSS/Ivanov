# DeFi Dashboard - Тестовое задание

## ✅ Что реализовано

### Архитектура

- ✅ **Next.js 14** + TypeScript (no TypeScript errors)
- ✅ **Server/Client разделение**: page.tsx - Server Component, компоненты - Client Components
- ✅ **Server Actions**: все запросы к бэку идут через ServerActions (wallet.actions, chart.actions, positions.actions)
- ✅ **Caching**: 1 минута кеширования результатов на сервере (по publicKey)

### UI/Дизайн (2 основных блока)

1. **My Wallet блок** (левый)
   - Иконка кошелька с градиентом
   - Название "My Wallet" и дата присоединения
   - Показатель Portfolio (Not USDC)
   - Большое число баланса в WETH
   - Прирост за день (зелёный/красный)
   - Две кнопки: Deposit и Withdraw с Motion анимациями

2. **Profit/Loss блок** (правый)
   - Заголовок "Profit/Loss" с иконкой
   - Временные фильтры: 1H, 6H, 1D, 1W, 1M, All
   - Крупное число с P&L
   - День недели при наведении
   - График (Area Chart) с оранжевым цветом и заливкой
   - Интерактивность: при наведении на график обновляется значение выше

### Функционал

- ✅ **NumberFlow** - красивая анимация чисел при изменении
- ✅ **Motion анимации** - все кнопки и карты имеют:
  - `whileHover={{ scale: 1.05 }}`
  - `whileDrag={{ scale: 0.96 }}`
  - `whileTap={{ scale: 0.95 }}`
  - Плавные переходы при загрузке (opacity, y translation)

- ✅ **Deposit/Withdraw** - ServerAction функции с моком
- ✅ **EtherScan интеграция**:
  - `getEthPrice()` - получение текущей цены ETH
  - `getTokenBalance()` - получение баланса токена
  - `getTokenTransfers()` - получение транзакций
  - Fallback значения на случай ошибок API

- ✅ **Профиль для .env**:
  - `RPC_URL` - для подключения к блокчейну
  - `WALLET_PRIVATE_KEY` - приватный ключ кошелька (SERVER ONLY)
  - `PUBLIC_WALLET_ADDRESS` - публичный адрес
  - `TOKEN_ADDRESS` - адрес токена (WETH)
  - `ETHERSCAN_API_KEY` - ключ API EtherScan
  - `NEXT_PUBLIC_CHAIN_ID` - ID цепи

### Дополнительные компоненты

- ✅ **PortfolioStats** - карточки со статистикой (Total Value, 24h Change, High, Low)
- ✅ **TransactionHistory** - история недавних транзакций
- ✅ **PageHeader** - красивый заголовок страницы

### Стили

- ✅ **Tailwind CSS** - все стили через классы
- ✅ **Custom CSS** - глобальные стили в globals.css
- ✅ **Responsive Design** - работает на мобильных и десктопе
- ✅ **Gradient backgrounds** - красивый градиент оранжевого цвета

## 🚀 Как запустить

```bash
# Установить зависимости
npm install

# Запустить dev сервер
npm run dev

# Открыть http://localhost:3001
```

## 📝 Структура проекта

```
src/
├── app/
│   ├── page.tsx                    # Main Server Component
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles (Tailwind)
│   ├── actions/
│   │   ├── wallet.actions.ts       # Deposit, withdraw, balance
│   │   ├── chart.actions.ts        # Chart data
│   │   └── positions.actions.ts    # P&L calculation
│   ├── components/
│   │   ├── BalanceCard.tsx         # Left block (Wallet)
│   │   ├── ChartBlock.tsx          # Right block (Profit/Loss)
│   │   ├── ChartView.tsx           # Area Chart with Recharts
│   │   ├── TimeframeSelector.tsx   # Timeframe buttons
│   │   ├── MotionButton.tsx        # Button with Motion
│   │   ├── PageHeader.tsx          # Page title
│   │   ├── PortfolioStats.tsx      # Stats cards
│   │   ├── TransactionHistory.tsx  # Transaction list
│   │   ├── ChartSkeleton.tsx       # Loading skeleton
│   │   └── ToasterProvider.tsx     # Toast notifications
│   ├── lib/
│   │   ├── wallet.ts               # Wallet utilities
│   │   ├── etherscan.ts            # EtherScan API
│   │   ├── cache.ts                # Server-side caching
│   │   ├── ethers.ts               # Ethers.js setup
│   │   ├── format.ts               # Format utilities
│   │   └── safeRpc.ts              # Safe RPC provider
│   └── types/
│       └── chart.ts                # TypeScript types
├── .env.local                      # Environment variables
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── tailwind.config.ts              # Tailwind config
└── postcss.config.js               # PostCSS config
```

## 🔧 Используемые библиотеки

- **Next.js 14.1** - React framework
- **React 18.2** - UI library
- **TypeScript 5.3** - Type safety
- **Framer Motion 11** - Animations (whileHover, whileDrag, whileTap)
- **NumberFlow** - Number animations
- **Recharts 2.12** - Charts (Area Chart)
- **Ethers.js 6.10** - Blockchain interactions
- **Tailwind CSS 3.4** - Styling
- **React Hot Toast 2.6** - Notifications

## 📊 Как работает функционал

### Deposit/Withdraw

1. Пользователь кликает на кнопку
2. Вызывается ServerAction `handleDeposit()` или `handleWithdraw()`
3. Функция логирует транзакцию и возвращает hash
4. Баланс перезагружается через `getWalletBalance()`
5. NumberFlow красиво анимирует новое значение

### График

1. При загрузке вызывается `getChartData(publicKey, timeframe)`
2. Данные кешируются на 1 минуту на сервере
3. При наведении на график `onHover` обновляет значение
4. NumberFlow анимирует число
5. При изменении timeframe данные перезагружаются

### Запросы к EtherScan

1. Все запросы выполняются на сервере (ServerActions)
2. Добавлены fallback значения на случай ошибок
3. Кеширование результатов: 30 сек для баланса, 1 мин для чарта

## 🎨 Motion Анимации

Все интерактивные элементы имеют:

```typescript
whileHover={{ scale: 1.05, translateY: -2 }}
whileDrag={{ scale: 0.96 }}
whileTap={{ scale: 0.95 }}
transition={{ type: "spring", stiffness: 400, damping: 10 }}
```

Карточки загружаются с:

```typescript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
```

## 🔐 Безопасность

- ✅ Private Key хранится только в `.env.local` (не коммитится)
- ✅ Все операции с wallet выполняются на сервере (ServerActions)
- ✅ Public Key доступен в клиентской части для фильтрации данных
- ✅ API ключи защищены (NEXT*PUBLIC* префиксом управляется доступ)

## 📱 Responsive Design

- ✅ 1 column на мобильных (320px+)
- ✅ 2 columns на планшетах/десктопах (1024px+)
- ✅ Оптимальная читаемость на всех размерах

## 🎯 TODO для production

1. Заменить mock данные на реальные вызовы смарт-контрактов
2. Добавить правильный расчёт P&L через позиции
3. Реальная работа с приватным ключом (в production использовать Web3Modal)
4. Более детальные логи ошибок
5. Rate limiting для API запросов
6. Интеграция с Web3Auth для безопасного управления ключами

## 📞 Контакты

По вопросам о коде - смотрите комментарии в коде и документацию компонентов.
