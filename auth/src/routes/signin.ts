import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { User } from '../models/user';
import { googleOAuthClient } from '../services/google-oauth-client';
import { verifyIdToken, fetchProfileFromPayload } from '../services/google-oauth';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';
import { UserProfile } from '../types/user-profile';

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
    const loginTicket = await verifyIdToken(tokens.id_token);
    const payloadUserProfile = fetchProfileFromPayload(loginTicket);
    if (!payloadUserProfile) {
      throw new BadRequestError('Could not retrieve user profile from ID Token payload');
    }
    const currentUser: UserProfile = {
      id: payloadUserProfile.id,
      email: payloadUserProfile.email,
      name: payloadUserProfile.name,
      photoURL: payloadUserProfile.photoURL,
    };
    const dbUser = await User.findOne({ googleId: currentUser.id });
    if (!dbUser) {
      const user = User.build({
        googleId: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        photoURL: currentUser.photoURL,
      });
      await user.save();
    }
    req.session = {
      idToken: tokens.id_token,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date,
      currentUser,
    };
    res.send(currentUser);
  },
);

export { router as signinRouter };
