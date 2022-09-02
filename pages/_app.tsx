import { useCallback } from "react";
import { ClientProvider } from "@micro-stacks/react";
import { destroySession, saveSession } from "../common/fetchers";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClientProvider
      network="testnet"
      appName="Stacks Dashboard"
      appIconUrl="/vercel.svg"
      dehydratedState={pageProps?.dehydratedState}
      onPersistState={useCallback(async (dehydratedState: string) => {
        await saveSession(dehydratedState);
      }, [])}
      onSignOut={useCallback(async () => {
        await destroySession();
      }, [])}
    >
      <Component {...pageProps} />
    </ClientProvider>
  );
}

export default MyApp;
