import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { googleOAuthClient } from '../services/google-oauth-client';

const router = express.Router();

router.post(
  '/api/auth/google',
  [body('code').trim().notEmpty().withMessage('You must provide a code')],
  async (req: Request, res: Response) => {
    const { tokens } = await googleOAuthClient.getToken(req.body.code);
    if (!tokens.id_token) {
      throw new Error('Could not retrieve google token');
    }
    const googleOAuth = await googleOAuthClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const userId = googleOAuth.getUserId();
    const userInfo = googleOAuth.getPayload();
    if (!userInfo?.email || !userInfo?.name || !userId) {
      throw new Error('Could not retrieve user profile info');
    }
    const currentUser = {
      id: userId,
      email: userInfo.email,
      name: userInfo.name,
      photoURL: userInfo.picture,
    };
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
