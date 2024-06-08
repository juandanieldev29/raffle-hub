import { Request, Response, NextFunction } from 'express';

import { getGoogleOAuthProfile, refreshGoogleToken } from '../services/google-oauth-profile';
import { UserProfile } from '../types/user-profile';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: UserProfile;
    }
  }
}

export const currentUser = async (req: Request, _res: Response, next: NextFunction) => {
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
    console.log(err);
    req.session = null;
  }
  next();
};
