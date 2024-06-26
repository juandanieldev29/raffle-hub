export interface RafflesPaginationResult<T> {
  metadata: {
    count: number;
  };
  raffles: T[];
}
