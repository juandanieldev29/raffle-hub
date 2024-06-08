import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { Raffle } from '../models/raffle';
import { validateRequest } from '../middlewares/validate-request';
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';

const router = express.Router();

router.post(
  '/api/raffles',
  currentUser,
  requireAuth,
  [
    body('prize').isInt({ gt: 0 }).withMessage('Prize must be greater than 0'),
    body('quantityNumbers')
      .optional()
      .isInt({ gt: 0 })
      .withMessage('The quantity of numbers must be greater than 0'),
    body('quantitySeries')
      .optional()
      .isInt({ gt: 0 })
      .withMessage('The quantity of series must be greater than 0'),
    body('ticketPrice').isInt({ min: 0 }).withMessage('Ticket price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { prize, quantityNumbers, quantitySeries, ticketPrice } = req.body;
    const raffle = Raffle.build({
      prize,
      quantityNumbers,
      quantitySeries,
      ticketPrice,
      userId: '123',
    });
    await raffle.save();
    res.status(201).send(raffle);
  },
);

export { router as createRaffleRouter };
