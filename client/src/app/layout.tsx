import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Header from '@/components/header';

import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RaffleHub',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <Header />
          {children}
        </GoogleOAuthProvider>
        <Script src="https://kit.fontawesome.com/ecb1fa5ff2.js" crossOrigin="anonymous" />
      </body>
    </html>
  );
}