import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID must be defined');
  }
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('GOOGLE_CLIENT_SECRET must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  await mongoose.connect(process.env.MONGO_URI);
  app.listen(3002, () => {
    console.log('Listening on port 3002!');
  });
};

start();
