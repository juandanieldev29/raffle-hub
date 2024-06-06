import { app } from './app';

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID must be defined');
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('GOOGLE_CLIENT_SECRET must be defined');
}
app.listen(3001, () => {
  console.log('Listening on port 3001!');
});
