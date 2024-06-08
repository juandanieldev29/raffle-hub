import express, { Request, Response } from 'express';

import { Raffle } from '../models/raffle';
import { Ticket } from '../models/ticket';
import { NotFoundError } from '../errors/not-found-error';

const router = express.Router();

router.get('/api/raffles/:id/available-numbers', async (req: Request, res: Response) => {
  const raffle = await Raffle.findById(req.params.id);
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
});

export { router as availableNumbersRaffleRouter };
