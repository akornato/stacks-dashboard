import { useState, useEffect } from "react";
import Head from "next/head";
import { WalletConnectButton } from "../components/WalletConnectButton";
import { GetStxButton } from "../components/GetStxButton";
import { TransactionsTable } from "../components/TransactionsTable";
import { useAuth, useAccount } from "@micro-stacks/react";
import { getDehydratedStateFromSession } from "../common/session-helpers";
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

  useEffect(() => {
    if (isSignedIn) {
      fetch(
        `https://stacks-node-api.testnet.stacks.co/extended/v1/address/${stxAddress}/transactions`
      )
        .then((response) => response.json())
        .then(setTransactions)
        .catch(console.log);
    }
  }, [isSignedIn, stxAddress]);

  return (
    <>
      <Head>
        <title>Stacks Dashboard</title>
        <link rel="icon" href="favicon.ico" />
      </Head>

      <div>
        <WalletConnectButton />
      </div>
      {isSignedIn && (
        <div>
          <GetStxButton address={stxAddress} />
          {transactions && transactions.results.length > 0 && (
            <TransactionsTable transactions={transactions} />
          )}
        </div>
      )}
    </>
  );
};

export default Home;
