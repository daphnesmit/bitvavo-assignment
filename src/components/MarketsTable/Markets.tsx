import { useQuery } from '@tanstack/react-query';
import { Ticker24hData, bitvavoClient } from '../../utils/bitvavo';
import { Loader } from '../Loader/Loader';
import { MarketsProvider } from './MarketsProvider';
import { MarketsTable } from './MarketsTable';

export const Markets = () => {
  const { isLoading, error, data } = useQuery<Ticker24hData[]>({
    queryKey: ['ticker24h'],
    queryFn: bitvavoClient.query.ticker24h,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <Loader />;

  if (error || !data) {
    return (
      <div className="mx-auto text-center lg:w-4/6">
        <h2 className="mb-5 text-4xl font-bold">Market data not available</h2>
        <p className=" text-rose-700">
          We are very sorry. The market data could not be loaded. Please come back later.
        </p>
      </div>
    );
  }

  return (
    <MarketsProvider data={data}>
      <MarketsTable />
    </MarketsProvider>
  );
};
