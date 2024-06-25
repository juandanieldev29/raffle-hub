import { Request, Response, NextFunction } from 'express';

import {
  verifyIdToken,
  refreshCredentials,
  fetchProfileFromPayload,
  fetchProfileFromGoogle,
} from '../services/google-oauth';
import { UserProfile } from '../types/user-profile';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: UserProfile;
    }
  }
}

interface Credentials {
  idToken: string;
  accessToken: string;
  refreshToken: string;
  expiryDate: number;
}

export const currentUser = async (req: Request, _res: Response, next: NextFunction) => {
  if (
    !req.session?.idToken ||
    !req.session?.accessToken ||
    !req.session?.refreshToken ||
    !req.session?.expiryDate
  ) {
    req.session = null;
    return next();
  }
  let credentials: Credentials = {
    idToken: req.session.idToken,
    accessToken: req.session.accessToken,
    refreshToken: req.session.refreshToken,
    expiryDate: req.session.expiryDate,
  };
  try {
    const tokenExpirationTime = credentials.expiryDate;
    const currentTimestamp = Date.now();
    if (currentTimestamp > tokenExpirationTime) {
      console.log('Refreshing Google OAuth token');
      const refreshedCredentials = await refreshCredentials(req.session.refreshToken);
      if (
        !refreshedCredentials.id_token ||
        !refreshedCredentials.access_token ||
        !refreshedCredentials.refresh_token ||
        !refreshedCredentials.expiry_date
      ) {
        req.session = null;
        return next();
      }
      credentials = {
        idToken: refreshedCredentials.id_token,
        accessToken: refreshedCredentials.access_token,
        refreshToken: refreshedCredentials.refresh_token,
        expiryDate: refreshedCredentials.expiry_date,
      };
      req.session = {
        ...req.session,
        idToken: refreshedCredentials.id_token,
        accessToken: refreshedCredentials.access_token,
        refreshToken: refreshedCredentials.refresh_token,
        expiryDate: refreshedCredentials.expiry_date,
      };
    }
    const loginTicket = await verifyIdToken(credentials.idToken);
    if (req.session.currentUser && req.session.currentUser.id === loginTicket.getUserId()) {
      return next();
    }
    const payloadUserProfile = fetchProfileFromPayload(loginTicket);
    if (payloadUserProfile) {
      req.session = { ...req.session, currentUser: payloadUserProfile };
      return next();
    }
    const googleUserProfile = await fetchProfileFromGoogle(credentials.accessToken);
    req.session = { ...req.session, currentUser: googleUserProfile };
    return next();
  } catch (err) {
    console.log(err);
    req.session = null;
  }
  next();
};
