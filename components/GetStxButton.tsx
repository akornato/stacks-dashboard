import { useState } from "react";
import { Button, useToast } from "@chakra-ui/react";

export const GetStxButton: React.FC<{
  address?: string;
  onSuccess: (tx_id: string) => void;
}> = ({ address, onSuccess }) => {
  const [isFetching, setIsFetching] = useState(false);
  const toast = useToast();

  const getSTX = () => {
    setIsFetching(true);
    fetch("https://stacks-node-api.testnet.stacks.co/extended/v1/faucets/stx", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        stacking: false,
      }),
    })
      .then((response) => {
        if (response.ok) {
          toast({
            description: `STX requested`,
            status: "success",
            isClosable: true,
          });
          response.json().then(({ txId }) => onSuccess(txId));
        } else {
          throw new Error(`Network status ${response.status}`);
        }
      })
      .catch((error) =>
        toast({ description: error.message, status: "error", isClosable: true })
      )
      .finally(() => setIsFetching(false));
  };

  return (
    <Button onClick={getSTX} isLoading={isFetching}>
      Get STX
    </Button>
  );
};
