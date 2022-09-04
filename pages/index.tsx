import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import { Box, Stack } from "@chakra-ui/react";
import { WalletConnectButton } from "../components/WalletConnectButton";
import { GetStxButton } from "../components/GetStxButton";
import { TransactionsTable } from "../components/TransactionsTable";
import { NetworkToggle } from "../components/NetworkToggle";
import { useAuth, useAccount, useNetwork } from "@micro-stacks/react";
import { getDehydratedStateFromSession } from "../common/session-helpers";
import {
  connectWebSocketClient,
  StacksApiWebSocketClient,
} from "@stacks/blockchain-api-client";
import type { NextPage, GetServerSidePropsContext } from "next";
import type { Transaction } from "@stacks/stacks-blockchain-api-types";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return {
    props: {
      dehydratedState: await getDehydratedStateFromSession(ctx),
    },
  };
}

type Subscription = Awaited<
  ReturnType<StacksApiWebSocketClient["subscribeBlocks"]>
>;

const Home: NextPage = () => {
  const { isSignedIn } = useAuth();
  const { stxAddress } = useAccount();
  const { isMainnet } = useNetwork();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const wsClient = useRef<StacksApiWebSocketClient>();
  const subscriptions = useRef<{ [tx_id: string]: Subscription }>({});

  const fetchTransaction = useCallback(
    (tx_id: string) =>
      fetch(
        `https://stacks-node-api.testnet.stacks.co/extended/v1/tx/${tx_id}`
      ).then((response) => response.json()),
    []
  );

  const updateTransaction = useCallback(
    async (tx_id: string) => {
      const updatedTransaction: Transaction = await fetchTransaction(tx_id);

      setTransactions((transactions) => {
        const index =
          transactions.findIndex(
            (transaction) => transaction.tx_id === updatedTransaction.tx_id
          ) || 0;
        return [
          ...transactions.slice(0, index),
          updatedTransaction,
          ...transactions.slice(index + 1),
        ];
      });

      fetch(`/api/cache/${stxAddress}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTransaction),
      });

      if (wsClient.current) {
        if (
          // @ts-ignore
          updatedTransaction.tx_status !== "pending" &&
          subscriptions.current[tx_id]
        ) {
          console.log(`Unsubscribe for ${tx_id}`);
          await subscriptions.current[tx_id].unsubscribe();
          delete subscriptions.current[tx_id];
        }
        if (
          // @ts-ignore
          updatedTransaction.tx_status === "pending" &&
          !subscriptions.current[tx_id]
        ) {
          console.log(`Subscribe for ${tx_id}`);
          subscriptions.current[tx_id] =
            await wsClient.current.subscribeTxUpdates(tx_id, async () =>
              updateTransaction(tx_id)
            );
        }
      }
    },
    [stxAddress, fetchTransaction]
  );

  const createTransaction = useCallback(
    async (tx_id: string) => {
      const transaction: Transaction = await fetchTransaction(tx_id);

      setTransactions((transactions) => [...transactions, transaction]);

      fetch(`/api/cache/${stxAddress}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      });

      if (wsClient.current && !subscriptions.current[tx_id]) {
        console.log(`Subscribe for ${tx_id}`);
        subscriptions.current[tx_id] =
          await wsClient.current.subscribeTxUpdates(tx_id, async () =>
            updateTransaction(tx_id)
          );
      }
    },
    [stxAddress, fetchTransaction, updateTransaction]
  );

  useEffect(() => {
    if (isSignedIn && stxAddress) {
      const init = async () => {
        setIsLoading(true);
        const cachedTransactions: Transaction[] = await fetch(
          `/api/cache/${stxAddress}/read`
        ).then((response) => response.json());
        setTransactions(cachedTransactions);
        setIsLoading(false);

        await connectWebSocketClient(
          `wss://stacks-node-api.${
            isMainnet ? "mainnet" : "testnet"
          }.stacks.co/`
        ).then((client) => {
          wsClient.current = client;
        });

        cachedTransactions
          // @ts-ignore
          .filter(({ tx_status }) => tx_status === "pending")
          .forEach((transaction) => updateTransaction(transaction.tx_id));
      };
      init();
    }

    const unsubscribeAll = () =>
      Object.entries(subscriptions.current).forEach(async ([tx_id, sub]) => {
        console.log(`Unsubscribe for ${tx_id}`);
        await sub.unsubscribe();
        delete subscriptions.current[tx_id];
      });

    if (!isSignedIn) {
      setTransactions([]);
      unsubscribeAll();
    }

    return unsubscribeAll;
  }, [isSignedIn, stxAddress, isMainnet, updateTransaction]);

  return (
    <>
      <Head>
        <title>Stacks Dashboard</title>
        <link rel="icon" href="favicon.ico" />
      </Head>
      <Box p={4}>
        <Stack direction="row" spacing={4}>
          <WalletConnectButton />
          {isSignedIn && (
            <>
              <NetworkToggle />
              <GetStxButton
                address={stxAddress}
                known_tx_ids={transactions.map(({ tx_id }) => tx_id)}
                onSuccess={createTransaction}
              />
            </>
          )}
        </Stack>
        {isSignedIn && (
          <Box mt={8}>
            <TransactionsTable
              transactions={transactions}
              isLoading={isLoading}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default Home;
