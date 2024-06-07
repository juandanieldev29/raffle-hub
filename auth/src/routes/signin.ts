import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { googleOAuthClient } from '../services/google-oauth-client';
import { getGoogleOAuthProfile } from '../services/google-oauth-profile';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post(
  '/api/auth/google',
  [body('code').trim().notEmpty().withMessage('You must provide a code')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { tokens } = await googleOAuthClient.getToken(req.body.code);
    if (!tokens.id_token) {
      throw new BadRequestError('ID Token not present in google oAuth response');
    }
    const currentUser = await getGoogleOAuthProfile(tokens.id_token);
    req.session = {
      idToken: tokens.id_token,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date,
    };
    res.send(currentUser);
  },
);

export { router as signinRouter };
