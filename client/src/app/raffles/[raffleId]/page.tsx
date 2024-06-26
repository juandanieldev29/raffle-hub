import { headers } from 'next/headers';
import axios from 'axios';

import RaffleCard from '@/components/raffle-card';
import { formatNumber, formatDate, range } from '@/utils/utils';
import { IRaffle } from '@/types/raffle';
import { CurrentUser } from '@/types/current-user';

type RaffleDetails = {
  currentUser: CurrentUser | null;
  raffle: IRaffle;
  availableNumbers: Array<number>;
};

async function fetchData(raffleId: string): Promise<RaffleDetails> {
  const headersList = Array.from(headers().entries());
  const headersObject = headersList.reduce((accumulator, [key, value]) => {
    return { ...accumulator, [key]: value };
  }, {});
  const [{ data: raffle }, { data: availableNumbers }, { data: currentUserData }] =
    await Promise.all([
      axios.get<IRaffle>(`http://localhost:3002/api/raffles/${raffleId}`, {
        headers: headersObject,
        withCredentials: true,
      }),
      axios.get<Array<number>>(`http://localhost:3002/api/raffles/${raffleId}/available-numbers`),
      axios.get<{ currentUser: CurrentUser | null }>('http://localhost:3001/api/auth/currentUser', {
        headers: headersObject,
        withCredentials: true,
      }),
    ]);
  return { raffle, availableNumbers, currentUser: currentUserData.currentUser };
}

export default async function RaffleShow({ params }: { params: { raffleId: string } }) {
  const { raffle, availableNumbers, currentUser } = await fetchData(params.raffleId);
  return (
    <main className="mt-8 text-slate-700 dark:text-slate-200">
      <h1 className="w-[95%] md:w-11/12 mx-auto mb-8 text-5xl">Raffle Details</h1>
      <RaffleCard raffle={raffle} />
      <h2 className="w-[95%] md:w-11/12 mx-auto mb-8 text-3xl font-medium">
        Números disponibles para compra
      </h2>
      <div className="w-[95%] md:w-11/12 mx-auto md:p-4 mb-4 rounded-2xl flex justify-center bg-slate-50 dark:bg-slate-900 shadow-lg">
        <div className="grid grid-cols-10 grid-rows-10 w-full md:w-fit place-items-center relative">
          {range(0, raffle.lastAvailableNumber, 1).map((x) => {
            const isNumberBought = !availableNumbers.includes(x);
            return (
              <div
                key={x}
                className={`w-10 h-10 relative ${isNumberBought ? 'cursor-not-allowed' : 'cursor-pointer md:hover:dark:bg-blue-900 transition-transform duration-300'}`}
              >
                <div className="border border-solid text-center relative leading-10">{x}</div>
                {isNumberBought && (
                  <div className="absolute top-1/2 left-1/2 h-[60%] w-[60%] translate-y-[-50%] translate-x-[-50%] bg-black dark:bg-slate-200 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {currentUser?.id === raffle.owner.id && (
        <>
          <h2 className="w-[95%] md:w-11/12 mx-auto mb-8 text-3xl font-medium">
            Historial de compras
          </h2>
          <div className="raffle w-[95%] md:w-11/12 mx-auto p-4 mb-4 rounded-2xl grid md:grid-cols-3 bg-slate-50 dark:bg-slate-900 shadow-lg">
            <h3 className="text-2xl md:col-start-1 h-8 font-semibold">Total recaudado</h3>
            <p className="md:row-start-2 font-medium text-xl mb-8">
              {formatNumber(raffle.tickets.length * raffle.ticketPrice)}
            </p>
            <h3 className="text-2xl md:col-start-2 h-8 font-semibold">Números vendidos</h3>
            <p className="md:row-start-2 font-medium text-xl mb-8">{raffle.tickets.length}</p>
            {raffle.tickets.map(({ id, buyer, number, createdAt }) => {
              return (
                <div
                  key={id}
                  className="md:col-start-1 flex md:col-span-3 border-b justify-between items-center"
                >
                  <p className="md:col-start-1 p-2">
                    {buyer.name} compro el número {number}
                  </p>
                  <p className="md:col-start-3" suppressHydrationWarning>
                    {formatDate(createdAt)}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
