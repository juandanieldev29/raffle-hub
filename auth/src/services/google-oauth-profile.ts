import { UserRefreshClient } from 'google-auth-library';

import { googleOAuthClient } from './google-oauth-client';
import { UserProfile } from '../types/user-profile';

export const getGoogleOAuthProfile = async (idToken: string): Promise<UserProfile> => {
  const googleOAuth = await googleOAuthClient.verifyIdToken({
    idToken: idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const userId = googleOAuth.getUserId();
  const userInfo = googleOAuth.getPayload();
  if (!userInfo?.email || !userInfo?.name || !userId) {
    throw new Error('Could not retrieve user profile info');
  }
  return {
    id: userId,
    email: userInfo.email,
    name: userInfo.name,
    photoURL: userInfo.picture,
  };
};

export const refreshGoogleToken = async (refreshToken: string): Promise<UserProfile> => {
  const user = new UserRefreshClient(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    refreshToken,
  );
  const { credentials } = await user.refreshAccessToken();
  if (!credentials.id_token) {
    throw new Error('ID Token not present in google oAuth process');
  }
  return await getGoogleOAuthProfile(credentials.id_token);
};