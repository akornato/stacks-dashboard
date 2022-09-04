import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const transactions = await prisma.transaction.findMany({
    where: { user: req.query.user?.toString() },
  });
  res.status(200).json(
    transactions.map(({ token_transfer_amount, block_height, ...rest }) => ({
      ...rest,
      ...(block_height ? { block_height } : {}),
      ...(token_transfer_amount
        ? { token_transfer: { amount: token_transfer_amount } }
        : {}),
    }))
  );
};

export default handler;
