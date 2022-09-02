import type { TransactionResults } from "@stacks/stacks-blockchain-api-types";

export const TransactionsTable: React.FC<{
  transactions: TransactionResults;
}> = ({ transactions }) => {
  console.log(transactions);
  return (
    <table>
      <thead>
        <tr>
          <th>Tx ID</th>
          <th>Tx Status</th>
          <th>Tx Type</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.results.map((tx) => (
          <tr key={tx.tx_id}>
            <td>{tx.tx_id}</td>
            <td>{tx.tx_status}</td>
            <td>{tx.tx_type}</td>
            {/* @ts-ignore */}
            <td>{tx.token_transfer?.amount || ""}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
