import { updateTicker24Data } from '../updateTicker24Data';
import { Ticker24hData } from '../../../../utils/queries';

describe('updateTicker24Data', () => {
  it('should update the ticker 24h data correctly', () => {
    const oldData: Ticker24hData[] = [
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
    ];

    const newData: Ticker24hData[] = [
      {
        market: 'BTC-EUR',
        last: '1',
        high: '1',
        low: '1',
        volume: '1',
        volumeQuote: '1',
        bid: '1',
        ask: '1',
        bidSize: '1',
        askSize: '1',
        open: '1',
        timestamp: 163123456788,
      },
    ];

    const updatedData = updateTicker24Data(oldData, newData);

    expect(updatedData).toEqual([...newData, oldData[1]]);
  });
});
