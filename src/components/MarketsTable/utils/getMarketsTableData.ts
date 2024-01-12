import { markets } from '../../../data/markets';
import { Ticker24hData } from '../../../utils/bitvavo';
import { calculateChange } from './calculateChange';

export interface MarketTableData {
  symbol: string;
  market: string;
  price: string | null;
  change: string | null;
  volume: string | null;
}

export const getMarketsTableData = (data: Ticker24hData[]): MarketTableData[] => {
  return Object.keys(markets).map((key) => {
    const item = data.find((item) => item.market === key);
    const [symbol] = key.split('-');

    return {
      symbol,
      market: markets[key],
      price: item?.last || null,
      change: item ? calculateChange(item) : null,
      volume: item?.volumeQuote || null,
    };
  });
};
