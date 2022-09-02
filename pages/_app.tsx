import { useCallback } from "react";
import { ClientProvider } from "@micro-stacks/react";
import { ChakraProvider } from "@chakra-ui/react";
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
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ClientProvider>
  );
}

export default MyApp;
