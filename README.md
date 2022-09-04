## Stacks Dashboard

This app displays user transactions in [Stacks](https://www.stacks.co), an open-source network of decentralized apps and smart contracts built on Bitcoin.

TODO: read the transactions on SSR after this [issue in micros-stacks](https://github.com/fungible-systems/micro-stacks/issues/158) has been fixed. For now transactions are initially read on the client instead, hence the spinner on load.

- [Hiro Stacks API](https://docs.hiro.so/api) and [micro-stacks](https://github.com/fungible-systems/micro-stacks) to communicate with Stacks and [Hiro Wallet](https://wallet.hiro.so)
- [Next.js](https://nextjs.org/) with [iron-session](https://github.com/vvo/iron-session) to Server Side Render on a persisted state of the Hiro Wallet (minus private key)
- [PlanetScale DB](https://planetscale.com) with [Prisma](https://www.prisma.io) ORM to cache transactions, both pending and confirmed
- [WebSocket API Client](https://github.com/hirosystems/stacks-blockchain-api/tree/master/client) to update transactions on the client and in cache

On load / sign in / network change the app reads transactions from the cache and sets up a separate WebSocket subscription for each pending transaction.

On initiating transaction (i.e. Get STX), the app updates the UI, creates a new pending transaction in the cache, and sets up another subscription for it.

On transaction update event (i.e. transaction confirmed), the app updates the UI, updates the transaction in the cache, and clears the subscription.

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
