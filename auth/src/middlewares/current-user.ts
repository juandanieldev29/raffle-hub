import { Request, Response, NextFunction } from 'express';

import { googleOAuthClient } from '../services/google-oauth-client';

interface UserPayload {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.idToken) {
    return next();
  }
  try {
    const googleOAuth = await googleOAuthClient.verifyIdToken({
      idToken: req.session.idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const userId = googleOAuth.getUserId();
    const userInfo = googleOAuth.getPayload();
    if (!userInfo?.email || !userInfo?.name || !userId) {
      throw new Error('Could not retrieve user profile info');
    }
    req.currentUser = {
      id: userId,
      email: userInfo.email,
      name: userInfo.name,
      photoURL: userInfo.picture,
    };
  } catch (err) {}
  next();
};
