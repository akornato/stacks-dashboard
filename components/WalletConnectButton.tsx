import { useAuth } from "@micro-stacks/react";

export const WalletConnectButton = () => {
  const { openAuthRequest, isRequestPending, signOut, isSignedIn } = useAuth();

  const label = isRequestPending
    ? "Loading..."
    : isSignedIn
    ? "Sign out"
    : "Connect Stacks wallet";
    
  return (
    <button
      onClick={() => {
        if (isSignedIn) signOut();
        else openAuthRequest();
      }}
    >
      {label}
    </button>
  );
};
