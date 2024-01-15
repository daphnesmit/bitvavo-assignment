import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Ticker24hData, queries } from '../../utils/queries';
import { MarketsContext, MarketsContextProps } from './MarketsContext';
import { getMarketsTableData } from './utils/getMarketsTableData';

const MarketsProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { isLoading, error, data } = useQuery<Ticker24hData[]>({
    queryKey: ['ticker24h'],
    queryFn: queries.ticker24h,
    refetchOnWindowFocus: false,
  });

  const tableData = useMemo(() => getMarketsTableData(Array.isArray(data) ? data : []), [data]);

  const store: MarketsContextProps = useMemo(
    () => ({
      tableData,
      isLoading,
      hasError: !!error || !Array.isArray(data),
    }),
    [error, isLoading, data, tableData],
  );
  return <MarketsContext.Provider value={store}>{children}</MarketsContext.Provider>;
};

export { MarketsProvider };
