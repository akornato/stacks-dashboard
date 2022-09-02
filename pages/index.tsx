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
import type { NextPage, GetServerSidePropsContext } from "next";
import type { TransactionResults } from "@stacks/stacks-blockchain-api-types";

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
  const [transactions, setTransactions] = useState<
    TransactionResults | undefined
  >();
  const subscription = useRef();

  useEffect(() => {
    if (isSignedIn && stxAddress) {
      fetch(
        `https://stacks-node-api.testnet.stacks.co/extended/v1/address/${stxAddress}/transactions`
      )
        .then((response) => response.json())
        .then(setTransactions)
        .catch(console.log);

      connectWebSocketClient("wss://stacks-node-api.testnet.stacks.co/").then(
        (client) =>
          client.subscribeAddressTransactions(stxAddress, (event) =>
            console.log(event)
          )
      );
    }
    return;
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
        {isSignedIn && transactions && transactions.results.length > 0 && (
          <Box py={8}>
            <TransactionsTable transactions={transactions} />
          </Box>
        )}
      </Box>
    </>
  );
};

export default Home;
