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
  process.on('SIGINT', () => mongoose.disconnect());
  process.on('SIGTERM', () => mongoose.disconnect());
  app.listen(3001, () => {
    console.log('Listening on port 3001!');
  });
};

start();
