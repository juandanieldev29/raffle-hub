import express, { Request, Response } from 'express';

import { Raffle } from '../models/raffle';

const router = express.Router();

router.get('/api/raffles', async (_req: Request, res: Response) => {
  const raffles = await Raffle.find({
    complete: false,
  });
  res.send(raffles);
});

export { router as indexRaffleRouter };
