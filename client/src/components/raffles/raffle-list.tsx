'use client';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import RaffleCard from '@/components/raffles/raffle-card';
import Pagination from '@/components/pagination';
import { IRaffle } from '@/types/raffle';
import { RafflesPaginationResult } from '@/types/pagination';

interface RaffleListProps {
  rafflesPaginated: RafflesPaginationResult;
}

export default function RaffleList({ rafflesPaginated }: RaffleListProps) {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [rafflesMetadata, setRafflesMetadata] = useState<
    RafflesPaginationResult['metadata'] | null
  >(rafflesPaginated.metadata);
  const [localRaffles, setLocalRaffles] = useState<Array<IRaffle>>(rafflesPaginated.raffles);
  const pageInitiallyRendered = useRef(false);

  const fetchRaffles = async () => {
    const { data } = await axios.get<RafflesPaginationResult>('http://localhost:3002/api/raffles', {
      params: {
        page: currentPage,
        pageSize,
      },
      withCredentials: true,
    });
    setRafflesMetadata(data.metadata);
    setLocalRaffles(data.raffles);
  };

  useEffect(() => {
    if (pageInitiallyRendered.current) {
      fetchRaffles();
      return;
    }
    pageInitiallyRendered.current = true;
  }, [currentPage, pageSize]);

  return (
    <>
      {localRaffles.map((raffle) => {
        return (
          <RaffleCard
            key={raffle.id}
            raffle={raffle}
            includeLinkToDetails
            disableAnimations={false}
          />
        );
      })}
      {rafflesMetadata && (
        <Pagination
          totalResuls={rafflesMetadata?.count}
          pageSize={pageSize}
          setPage={setCurrentPage}
          activePage={currentPage}
        />
      )}
    </>
  );
}
