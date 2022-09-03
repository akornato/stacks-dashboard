import { useState } from "react";
import { Button, useToast } from "@chakra-ui/react";

export const GetStxButton: React.FC<{ address?: string }> = ({ address }) => {
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
