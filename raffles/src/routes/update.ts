import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { Raffle } from '../models/raffle';
import { Ticket } from '../models/ticket';
import { validateRequest } from '../middlewares/validate-request';
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';
import { NotFoundError } from '../errors/not-found-error';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.put(
  '/api/raffles/:id',
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
    const raffle = await Raffle.findById(req.params.id);
    if (!raffle) {
      throw new NotFoundError();
    }
    if (raffle.complete) {
      throw new BadRequestError('Cannot update completed raffles');
    }
    if (raffle.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    const ticketsBought = await Ticket.countDocuments({
      $or: [{ raffle: { $exists: false } }, { raffle: null }],
    });
    if (ticketsBought > 0) {
      throw new BadRequestError('Cannot update raffle when there are tickets already bought');
    }
    const { prize, quantityNumbers, quantitySeries, ticketPrice } = req.body;
    raffle.set({ prize, quantityNumbers, quantitySeries, ticketPrice });
    await raffle.save();
    res.send(raffle);
  },
);

export { router as updateRaffleRouter };
