import { getMinimumFractionDigitsPrice } from '../getMinimumFractionDigitsPrice';

describe('getMinimumFractionDigitsPrice', () => {
  it('should return the correct minimum fraction digits for formatting', () => {
    // Test cases
    const testCases = [
      { price: 0.1, expected: 5 },
      { price: 0.01, expected: 6 },
      { price: 1, expected: 4 },
      { price: 10, expected: 3 },
      { price: 100, expected: 2 },
      { price: 1000, expected: 1 },
    ];

    // Run the test cases
    testCases.forEach(({ price, expected }) => {
      const result = getMinimumFractionDigitsPrice(price);
      expect(result).toBe(expected);
    });
  });
});
