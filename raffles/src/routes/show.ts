import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { param } from 'express-validator';

import { Raffle } from '../models/raffle';
import { currentUser } from '../middlewares/current-user';
import { NotFoundError } from '../errors/not-found-error';

const router = express.Router();

router.get(
  '/api/raffles/:raffleId',
  currentUser,
  [
    param('raffleId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Raffle id must be provided'),
  ],
  async (req: Request, res: Response) => {
    const { raffleId } = req.params;
    const raffle = await Raffle.findById(raffleId);
    if (!raffle) {
      throw new NotFoundError();
    }
    if (raffle.owner.id === req.session?.currentUser?.id) {
      await raffle.populate('tickets');
    }
    res.send(raffle);
  },
);

export { router as showRaffleRouter };
