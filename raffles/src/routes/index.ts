import express, { Request, Response } from 'express';

import { Raffle } from '../models/raffle';

const router = express.Router();

interface Pagination {
  page?: number;
  pageSize?: number;
}

router.get('/api/raffles', async (req: Request<{}, {}, {}, Pagination>, res: Response) => {
  const { page = 1, pageSize = 10 } = req.query;
  const [raffles, count] = await Promise.all([
    Raffle.find({
      complete: false,
    })
      .skip((page - 1) * pageSize)
      .limit(pageSize),
    Raffle.countDocuments(),
  ]);
  res.send({ raffles, metadata: { count } });
});

export { router as indexRaffleRouter };
