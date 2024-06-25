import { UserRefreshClient, LoginTicket, Credentials } from 'google-auth-library';
import axios from 'axios';

import { googleOAuthClient } from './google-oauth-client';
import { UserProfile } from '../types/user-profile';

interface GoogleProfile {
  email: string;
  given_name: string;
  id: string;
  name: string;
  picture?: string;
  verified_email: boolean;
}

export const verifyIdToken = async (idToken: string): Promise<LoginTicket> => {
  return await googleOAuthClient.verifyIdToken({
    idToken: idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
};

export const fetchProfileFromPayload = (loginTicket: LoginTicket): UserProfile | null => {
  const userId = loginTicket.getUserId();
  const userInfo = loginTicket.getPayload();
  if (!userInfo?.email || !userInfo?.name || !userId) {
    return null;
  }
  return {
    id: userId,
    email: userInfo.email,
    name: userInfo.name,
    photoURL: userInfo.picture,
  };
};

export const fetchProfileFromGoogle = async (accessToken: string): Promise<UserProfile> => {
  const response = await axios.get<GoogleProfile>('https://www.googleapis.com/userinfo/v2/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const { id, email, name, picture } = response.data;
  return {
    id,
    email,
    name,
    photoURL: picture,
  };
};

export const refreshCredentials = async (refreshToken: string): Promise<Credentials> => {
  const user = new UserRefreshClient(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    refreshToken,
  );
  const { credentials } = await user.refreshAccessToken();
  return credentials;
};
