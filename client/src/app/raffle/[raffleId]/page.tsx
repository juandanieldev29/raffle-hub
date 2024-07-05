import { headers } from 'next/headers';

import RaffleDetail from '@/components/pages/raffle/show';

export default async function RaffleShowPage({ params }: { params: { raffleId: string } }) {
  const { raffleId } = params;
  const [raffleRes, availableNumbersRes, currentUserRes] = await Promise.all([
    fetch(`http://localhost:3000/api/raffle/${raffleId}`, {
      headers: headers(),
      cache: 'no-store',
    }),
    fetch(`http://localhost:3000/api/raffle/${raffleId}/available-numbers`, {
      cache: 'no-store',
    }),
    fetch('http://localhost:3000/api/auth/currentuser', {
      headers: headers(),
      cache: 'no-store',
    }),
  ]);
  const [raffle, availableNumbers, { currentUser }] = await Promise.all([
    raffleRes.json(),
    availableNumbersRes.json(),
    currentUserRes.json(),
  ]);

  return (
    <main className="mt-8 text-slate-700 dark:text-slate-200">
      <RaffleDetail raffle={raffle} availableNumbers={availableNumbers} currentUser={currentUser} />
    </main>
  );
}
