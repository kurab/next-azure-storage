import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { ItemType } from '../../types/ItemType';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<ItemType>>
) {
  const items = await prisma.item.findMany();
  return res.status(200).json(items);
}
