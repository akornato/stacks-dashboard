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

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
