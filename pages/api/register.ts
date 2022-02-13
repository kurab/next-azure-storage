import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';
import { ItemType } from '../../types/ItemType';

const prisma = new PrismaClient();

type ErrorMessageType = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ItemType | ErrorMessageType>
) {
  const { name } = req.body;
  if (!name) {
    return res.status(500).json({ error: 'Bad Request' });
  }
  let itemBody: Prisma.ItemCreateInput;
  itemBody = {
    name: name,
  };
  const item = await prisma.item.create({ data: itemBody });
  return res.status(200).json(item);
}
