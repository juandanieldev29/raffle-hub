'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

import RaffleCard from '@/components/raffle-card';
import { IRaffle } from '@/types/raffle';
import { RafflesPaginationResult } from '@/types/pagination';

export default function Home() {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [rafflesMetadata, setRafflesMetadata] = useState<
    RafflesPaginationResult<IRaffle>['metadata'] | null
  >(null);
  const [raffles, setRaffles] = useState<Array<IRaffle>>([]);

  const fetchRaffles = async () => {
    const { data } = await axios.get<RafflesPaginationResult<IRaffle>>(
      'http://localhost:3002/api/raffles',
      {
        params: {
          page: currentPage,
          pageSize,
        },
        withCredentials: true,
      },
    );
    setRafflesMetadata(data.metadata);
    setRaffles(data.raffles);
  };

  useEffect(() => {
    fetchRaffles();
  }, [currentPage, pageSize]);

  return (
    <main className="mt-8 text-slate-700 dark:text-slate-200">
      {raffles.map((raffle) => {
        return (
          <RaffleCard
            key={raffle.id}
            raffle={raffle}
            includeLinkToDetails
            disableAnimations={false}
          />
        );
      })}
    </main>
  );
}
