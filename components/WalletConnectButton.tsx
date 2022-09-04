import { useAuth } from "@micro-stacks/react";
import { Button } from "@chakra-ui/react";

export const WalletConnectButton = () => {
  const { openAuthRequest, signOut, isSignedIn } = useAuth();

  return (
    <Button
      onClick={() => {
        if (isSignedIn) signOut();
        else openAuthRequest();
      }}
    >
      {isSignedIn ? "Sign out" : "Connect wallet"}
    </Button>
  );
};
