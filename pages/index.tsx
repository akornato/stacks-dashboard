import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { Box, Stack } from "@chakra-ui/react";
import { WalletConnectButton } from "../components/WalletConnectButton";
import { GetStxButton } from "../components/GetStxButton";
import { TransactionsTable } from "../components/TransactionsTable";
import { NetworkToggle } from "../components/NetworkToggle";
import { useAuth, useAccount } from "@micro-stacks/react";
import { getDehydratedStateFromSession } from "../common/session-helpers";
import {
  connectWebSocketClient,
  StacksApiWebSocketClient,
} from "@stacks/blockchain-api-client";
import { unionBy } from "lodash";
import type { NextPage, GetServerSidePropsContext } from "next";
import type {
  Transaction,
  TransactionResults,
} from "@stacks/stacks-blockchain-api-types";

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
  const [transactions, setTransactions] = useState<Transaction[] | undefined>();
  const subscriptions = useRef<Subscription[]>();

  useEffect(() => {
    if (isSignedIn && stxAddress) {
      const getTransactions = async () => {
        const cachedTransactions: Transaction[] = await fetch(
          `/api/cache/${stxAddress}/find`
        ).then((response) => response.json());

        console.log("cachedTransactions", cachedTransactions);

        const [mempoolTransactionResults, transactionResults]: [
          mempoolTransactionResults: TransactionResults,
          transactionResults: TransactionResults
        ] = await Promise.all([
          fetch(
            `https://stacks-node-api.testnet.stacks.co/extended/v1/tx/mempool?recipient_address=${stxAddress}`
          ).then((response) => response.json()),
          fetch(
            `https://stacks-node-api.testnet.stacks.co/extended/v1/address/${stxAddress}/transactions?offset=${cachedTransactions.length}`
          ).then((response) => response.json()),
        ]);

        fetch(`/api/cache/${stxAddress}/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transactionResults?.results),
        });

        console.log("transactionResults", transactionResults);

        setTransactions(
          unionBy(
            cachedTransactions,
            transactionResults?.results,
            mempoolTransactionResults?.results,
            (transaction) => transaction.tx_id
          )
        );
      };
      getTransactions();

      connectWebSocketClient("wss://stacks-node-api.testnet.stacks.co/").then(
        async (client) => {
          subscriptions.current = [
            await client.subscribeBlocks((event) =>
              console.log("subscribeBlocks event", event)
            ),
            await client.subscribeAddressTransactions(
              stxAddress,
              async (event) => {
                console.log("subscribeAddressTransactions event", event);
                fetch(
                  `https://stacks-node-api.testnet.stacks.co/extended/v1/tx/${event.tx_id}`
                )
                  .then((response) => response.json())
                  .then((updatedTransaction: Transaction) => {
                    console.log("updatedTransaction", updatedTransaction);
                    setTransactions((transactions) =>
                      unionBy(
                        [updatedTransaction],
                        transactions,
                        (transaction) => transaction.tx_id
                      )
                    );
                  });
              }
            ),
          ];
        }
      );
    }

    if (!isSignedIn) {
      subscriptions.current?.forEach((sub) => sub.unsubscribe());
    }

    return () => subscriptions.current?.forEach((sub) => sub.unsubscribe());
  }, [isSignedIn, stxAddress]);

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
              <GetStxButton address={stxAddress} />
            </>
          )}
        </Stack>
        {isSignedIn && (
          <Box mt={8}>
            <TransactionsTable transactions={transactions} />
          </Box>
        )}
      </Box>
    </>
  );
};

export default Home;
