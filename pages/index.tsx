import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { Box, Stack } from "@chakra-ui/react";
import { WalletConnectButton } from "../components/WalletConnectButton";
import { GetStxButton } from "../components/GetStxButton";
import { TransactionsTable } from "../components/TransactionsTable";
import { NetworkToggle } from "../components/NetworkToggle";
import { useAuth, useAccount } from "@micro-stacks/react";
import { getDehydratedStateFromSession } from "../common/session-helpers";
import { connectWebSocketClient } from "@stacks/blockchain-api-client";
import { xorBy } from "lodash";
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

const Home: NextPage = () => {
  const { isSignedIn } = useAuth();
  const { stxAddress } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[] | undefined>();

  useEffect(() => {
    if (isSignedIn && stxAddress) {
      Promise.all([
        fetch(
          `https://stacks-node-api.testnet.stacks.co/extended/v1/tx/mempool?recipient_address=${stxAddress}`
        ).then((response) => response.json()),
        fetch(
          `https://stacks-node-api.testnet.stacks.co/extended/v1/address/${stxAddress}/transactions`
        ).then((response) => response.json()),
      ]).then(
        ([mempoolTransactionResults, transactionResults]: [
          mempoolTransactionResults: TransactionResults,
          transactionResults: TransactionResults
        ]) =>
          setTransactions(
            xorBy(
              mempoolTransactionResults?.results,
              transactionResults?.results,
              (transaction) => transaction.tx_id
            )
          )
      );

      connectWebSocketClient("wss://stacks-node-api.testnet.stacks.co/").then(
        (client) => {
          client.subscribeBlocks((event) =>
            console.log("subscribeBlocks event", event)
          );
          client.subscribeAddressTransactions(stxAddress, async (event) => {
            console.log("subscribeAddressTransactions event", event);
            fetch(
              `https://stacks-node-api.testnet.stacks.co/extended/v1/tx/${event.tx_id}`
            )
              .then((response) => response.json())
              .then((transaction: Transaction) => {
                console.log("transaction", transaction);
                setTransactions((transactions) =>
                  xorBy(
                    [transaction],
                    transactions,
                    (transaction) => transaction.tx_id
                  )
                );
              });
          });
        }
      );
    }
  }, [isSignedIn, stxAddress]);

  return (
    <>
      <Head>
        <title>Stacks Dashboard</title>
        <link rel="icon" href="favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
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
