import { Ticker24hData } from '../../../../utils/queries';
import { getMarketsTableData } from '../getMarketsTableData';

// Mock the markets module and provide a returned value
jest.mock('../../../../data/markets', () => ({
  __esModule: true,
  markets: {
    'BTC-EUR': 'Bitcoin',
    'AAVE-EUR': 'Aave',
    'ACH-EUR': 'Alchemy Pay',
  },
}));

describe('getMarketsTableData', () => {
  it('should return the correct table data', () => {
    const markets: Ticker24hData[] = [
      {
        market: 'BTC-EUR',
        last: '50000',
        high: '55000',
        low: '45000',
        volume: '1000',
        volumeQuote: '50000000',
        bid: '49000',
        ask: '51000',
        bidSize: '10',
        askSize: '15',
        open: '48000',
        timestamp: 1631234567890,
      },
      {
        market: 'ACH-EUR',
        last: '3000',
        high: '3500',
        low: '2500',
        volume: '2000',
        volumeQuote: '6000000',
        bid: '2900',
        ask: '3100',
        bidSize: '5',
        askSize: '8',
        open: '2800',
        timestamp: 1631234567890,
      },
      {
        market: 'AAVE-EUR',
        last: '1',
        high: '1.2',
        low: '0.8',
        volume: '5000',
        volumeQuote: '5000',
        bid: '0.9',
        ask: '1.1',
        bidSize: '2',
        askSize: '4',
        open: '0.95',
        timestamp: 1631234567890,
      },
    ];

    const tableData = getMarketsTableData(markets);

    expect(tableData).toEqual([
      {
        symbol: 'BTC',
        market: 'Bitcoin',
        price: '50000',
        volume: '50000000',
        change: '4.17',
      },
      { symbol: 'AAVE', market: 'Aave', price: '1', volume: '5000', change: '5.26' },
      { symbol: 'ACH', market: 'Alchemy Pay', price: '3000', volume: '6000000', change: '7.14' },
    ]);
  });
});
