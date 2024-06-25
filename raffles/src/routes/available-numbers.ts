import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { param } from 'express-validator';

import { Raffle } from '../models/raffle';
import { Ticket } from '../models/ticket';
import { NotFoundError } from '../errors/not-found-error';

const router = express.Router();

router.get(
  '/api/raffles/:raffleId/available-numbers',
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
    const tickets = await Ticket.find({ raffle }).select({ number: 1 });
    const boughtNumbers = tickets.map((x) => x.number);
    const availableNumbers = Array.from({ length: raffle.quantityNumbers }, (_, i) => i).filter(
      (x) => {
        return !boughtNumbers.includes(x);
      },
    );
    res.send(availableNumbers);
  },
);

export { router as availableNumbersRaffleRouter };
