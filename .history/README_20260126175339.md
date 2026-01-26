# DeFi Dashboard – Test Task

## Stack

- Next.js 14 (App Router)
- TypeScript
- Server Actions
- ethers v6
- Etherscan API
- Framer Motion
- NumberFlow
- Recharts

## Features

- On-chain balance fetching
- Deposit / Withdraw via server actions
- Profit / Loss tracking
- Interactive chart with hover + animations
- Server-side caching (60s)

## Security

- Private key is stored only in `.env`
- Wallet logic runs exclusively on server
- No API routes used

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Notes

- Chart data is cached per public key
- All blockchain interactions are server-side
- UI uses motion animations for all actions

```

```
