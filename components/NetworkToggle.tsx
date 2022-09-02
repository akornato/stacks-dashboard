import { useNetwork } from "@micro-stacks/react";
import { Stack, Radio, RadioGroup } from "@chakra-ui/react";

export const NetworkToggle = () => {
  const { isMainnet, setNetwork } = useNetwork();
  const network = isMainnet ? "mainnet" : "testnet";

  return (
    // @ts-ignore
    <RadioGroup onChange={setNetwork} value={network}>
      <Stack direction="row" spacing={4} py={2}>
        <Radio value="mainnet">Mainnet</Radio>
        <Radio value="testnet">Testnet</Radio>
      </Stack>
    </RadioGroup>
  );
};
