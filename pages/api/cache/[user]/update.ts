import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Transaction } from "@stacks/stacks-blockchain-api-types";

const prisma = new PrismaClient();

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = req.query;
  const transaction: Transaction = req.body;
  await prisma.transaction.update({
    where: { tx_id: transaction.tx_id },
    data: {
      user: user?.toString() || "",
      tx_id: transaction.tx_id,
      block_height: transaction.block_height,
      tx_status: transaction.tx_status,
      tx_type: transaction.tx_type,
      /* @ts-ignore */
      token_transfer_amount: transaction.token_transfer?.amount,
    },
  });
  res.status(200).end();
};

export default handler;
