import { useState } from "react";
import { Button } from "@chakra-ui/react";

export const GetStxButton: React.FC<{ address?: string }> = ({ address }) => {
  const [isFetching, setIsFetching] = useState(false);

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
      .then((response) => response.json())
      .then(console.log)
      .catch(console.log)
      .finally(() => setIsFetching(false));
  };

  return (
    <Button onClick={getSTX} isLoading={isFetching}>
      Get STX
    </Button>
  );
};
