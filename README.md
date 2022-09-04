## Stacks Dashboard

Dashboard for user transactions in [Stacks](https://www.stacks.co), an open-source network of decentralized apps and smart contracts built on Bitcoin.

- [Hiro Stacks API](https://docs.hiro.so/api) and [micro-stacks](https://github.com/fungible-systems/micro-stacks) to communicate with Stacks and [Hiro Wallet](https://wallet.hiro.so)
- [Next.js](https://nextjs.org/) with [iron-session](https://github.com/vvo/iron-session) to Server Side Render on a persisted state of the Hiro Wallet (minus private key)
- [PlanetScale DB](https://planetscale.com) with [Prisma](https://www.prisma.io) ORM to cache transactions, both pending and confirmed
- [Hiro WebSocket API Client](https://github.com/hirosystems/stacks-blockchain-api/tree/master/client) to update transactions on the client and in cache

On load / sign in / network change the app reads transactions from the cache for the signed in user account, fetches pending transactions from Hiro Stacks API, updates them on the UI and in cache, and finally sets up WebSocket subscriptions for those that are still pending.

On initiated transaction (i.e. Get STX), the app updates the UI, creates a new pending transaction in the cache, and sets up an update subscription for it.

On transaction update event (i.e. transaction confirmed), the app fetches an updated transaction from Hiro Stacks API, updates the UI, updates the transaction in the cache, and clears the subscription.

TODO: read the transactions on SSR instead after this [issue in micros-stacks](https://github.com/fungible-systems/micro-stacks/issues/158) has been fixed. For now transactions are initially read on the client instead, hence the spinner on load.

Deployed at https://stacks-dashboard.vercel.app

## Getting Started

Best deploy zero-config to a [Vercel](https://vercel.com) project and add PlanetScale DB integration to it.

Copy `.env.sample` to `.env` and fill in the env vars. Then run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
