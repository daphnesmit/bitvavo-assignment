import { createContext } from 'react';
import { MarketTableData } from './utils/getMarketsTableData';

export interface MarketsContextProps {
  tableData: MarketTableData[];
  hasError: boolean;
  isLoading: boolean;
}

export const MarketsContext = createContext<MarketsContextProps | undefined>(
  {} as MarketsContextProps,
);
