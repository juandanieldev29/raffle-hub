import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';
import mongoose from 'mongoose';

import { Raffle } from '../models/raffle';
import { Ticket } from '../models/ticket';
import { validateRequest } from '../middlewares/validate-request';
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';
import { NotFoundError } from '../errors/not-found-error';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post(
  '/api/raffles/:raffleId/purchase-number',
  currentUser,
  requireAuth,
  [
    param('raffleId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Raffle id must be provided'),
    body('token').not().isEmpty(),
    body('number').isInt({ min: 0 }).withMessage('Number to purchase must be 0 or greater than 0'),
    body('serie')
      .optional()
      .isInt({ min: 0 })
      .withMessage('The quantity of numbers must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { raffleId } = req.params;
    const raffle = await Raffle.findById(raffleId);
    if (!raffle) {
      throw new NotFoundError();
    }
    const { token, number, serie } = req.body;
    if (number > raffle.lastAvailableNumber) {
      throw new BadRequestError(
        `The raffle only has ${raffle.lastAvailableNumber} available numbers`,
      );
    }
    if (serie && !raffle.quantitySeries) {
      throw new BadRequestError('The raffle does not have series');
    }
    if (!serie && raffle.quantitySeries) {
      throw new BadRequestError('The purcharse must include a serie');
    }
    const ticket = await Ticket.findOne({ raffle, number });
    if (ticket) {
      throw new BadRequestError('The number has already been purchased');
    }
    const newTicket = Ticket.build({
      number,
      serie,
      raffle,
      buyer: req.session!.currentUser,
    });
    await newTicket.save();
    raffle.tickets.push(newTicket);
    await raffle.save();
    res.send(newTicket);
  },
);

export { router as purchaseNumberRouter };
