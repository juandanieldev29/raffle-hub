import express, { Request, Response } from 'express';

import { currentUser } from '../middlewares/current-user';

const router = express.Router();

router.get('/api/auth/currentuser', currentUser, async (req: Request, res: Response) => {
  res.send({ currentUser: req.session?.currentUser || null });
});

export { router as currentUserRouter };
