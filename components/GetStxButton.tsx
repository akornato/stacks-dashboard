import { useState } from "react";
import { Button, useToast } from "@chakra-ui/react";

export const GetStxButton: React.FC<{
  address?: string;
  known_tx_ids: string[];
  onSuccess: (tx_id: string) => void;
}> = ({ address, known_tx_ids, onSuccess }) => {
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
        if (!response.ok) {
          throw Error(response.statusText);
        }
        response.json().then(({ txId }) => {
          if (known_tx_ids.some((tx_id) => tx_id === txId)) {
            toast({
              description: `STX requested ok but the returned txId ${txId} already exists...`,
              status: "error",
              isClosable: true,
            });
          } else {
            toast({
              description: `STX requested`,
              status: "success",
              isClosable: true,
            });
            onSuccess(txId);
          }
        });
      })
      .catch((error) =>
        toast({
          description: error.message,
          status: "error",
          isClosable: true,
        })
      )
      .finally(() => setIsFetching(false));
  };

  return (
    <Button onClick={getSTX} isLoading={isFetching}>
      Get STX
    </Button>
  );
};
