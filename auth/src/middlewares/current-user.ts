import { Request, Response, NextFunction } from 'express';

import { getGoogleOAuthProfile, refreshGoogleToken } from '../services/google-oauth-profile';
import { UserProfile } from '../types/user-profile';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserProfile;
    }
  }
}

export const currentUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.idToken) {
    return next();
  }
  try {
    const tokenExpirationTime = req.session.expiryDate;
    const currentTimestamp = Date.now();
    if (currentTimestamp > tokenExpirationTime) {
      if (req.session.refreshToken) {
        req.currentUser = await refreshGoogleToken(req.session.refreshToken);
      }
    } else {
      req.currentUser = await getGoogleOAuthProfile(req.session.idToken);
    }
  } catch (err) {
    req.session = null;
  }
  next();
};
