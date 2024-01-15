import { calculateChange } from '../calculateChange';

describe('calculateChange', () => {
  it('should return the correct change percentage', () => {
    const update = {
      ask: '20.00',
      askSize: '0.00',
      bid: '12.00',
      bidSize: '0.00',
      open: '11.00',
      high: '13.00',
      low: '9.00',
      volume: '1000',
      market: 'AAVE',
      timestamp: 0,
      last: '11.50',
      volumeQuote: '11500',
    };

    const result = calculateChange(update);
    expect(result).toBe('45.45');
  });

  it('should return "0.00" if any of the required values are missing', () => {
    const update = {
      ask: '10.00',
      askSize: '0.00',
      bid: '12.00',
      bidSize: '0.00',
      open: null,
      high: '13.00',
      low: '9.00',
      volume: '1000',
      market: 'AAVE',
      timestamp: 0,
      last: '11.50',
      volumeQuote: '11500',
    };

    const result = calculateChange(update);
    expect(result).toBe('0.00');
  });
});
