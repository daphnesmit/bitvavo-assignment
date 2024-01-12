import { createContext } from 'react';
import { MarketTableData } from './utils/getMarketsTableData';

export interface MarketsContextProps {
  tableData: MarketTableData[];
}

export const MarketsContext = createContext<MarketsContextProps | undefined>(
  {} as MarketsContextProps,
);
