import { headers } from 'next/headers';
import axios from 'axios';

import RaffleList from '@/components/raffles/raffle-list';
import { parseNextHeaders } from '@/utils';
import { RafflesPaginationResult } from '@/types/pagination';

type RafflesList = {
  rafflesPaginated: RafflesPaginationResult;
};

async function fetchData(): Promise<RafflesList> {
  const parsedHeaders = parseNextHeaders(headers().entries());
  const [{ data: rafflesPaginated }] = await Promise.all([
    axios.get<RafflesPaginationResult>('http://localhost:3002/api/raffles', {
      headers: parsedHeaders,
      withCredentials: true,
    }),
  ]);
  return { rafflesPaginated };
}

export default async function Home() {
  const { rafflesPaginated } = await fetchData();

  return (
    <main className="mt-8 text-slate-700 dark:text-slate-200">
      <RaffleList rafflesPaginated={rafflesPaginated} />
    </main>
  );
}
