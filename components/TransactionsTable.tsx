import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import type { Transaction } from "@stacks/stacks-blockchain-api-types";

export const TransactionsTable: React.FC<{
  transactions?: Transaction[];
}> = ({ transactions }) => {
  return (
    <TableContainer>
      <Table size="sm">
        <TableCaption>Transactions</TableCaption>
        <Thead>
          <Tr>
            <Th>Tx ID</Th>
            <Th>Block</Th>
            <Th>Tx Status</Th>
            <Th>Tx Type</Th>
            <Th>Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions?.map((tx) => (
            <Tr key={tx.tx_id}>
              <Td>{tx.tx_id}</Td>
              <Td>{tx.block_height}</Td>
              <Td>{tx.tx_status}</Td>
              <Td>{tx.tx_type}</Td>
              {/* @ts-ignore */}
              <Td>{tx.token_transfer?.amount || ""}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
