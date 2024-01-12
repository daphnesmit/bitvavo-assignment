import { useEffect, useMemo, useState } from 'react';
import { markets } from '../../data/markets';
import { Ticker24hData, bitvavoClient } from '../../utils/bitvavo';
import { MarketsContext, MarketsContextProps } from './MarketsContext';
import { getMarketsTableData } from './utils/getMarketsTableData';
import { updateTicker24Data } from './utils/updateTicker24Data';

interface MarketsProviderProps {
  data: Ticker24hData[];
}

const MarketsProvider = ({ data, children }: React.PropsWithChildren<MarketsProviderProps>) => {
  const [ticker24Data, setTicker24Data] = useState<Ticker24hData[]>(data);

  const tableData = useMemo(() => getMarketsTableData(ticker24Data), [ticker24Data]);

  useEffect(() => {
    bitvavoClient.subscription.ticker24h(Object.keys(markets), (newData) => {
      setTicker24Data((oldData) => updateTicker24Data(oldData, newData));
    });
  }, []);

  const store: MarketsContextProps = useMemo(
    () => ({
      tableData,
    }),
    [tableData],
  );
  return <MarketsContext.Provider value={store}>{children}</MarketsContext.Provider>;
};

export { MarketsProvider };
