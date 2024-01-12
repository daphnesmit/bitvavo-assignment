/**
 * Calculates the minimum fraction digits needed for formatting a price.
 *
 * This version uses the logarithm to base 10 (Math.log10) to determine the order of magnitude
 * of the price and then calculates the number of decimal places needed.
 * The result is passed through Math.max to ensure it's never less than 0.
 *
 * @param {number} price - The price value.
 * @returns {number} The minimum fraction digits required for formatting.
 */
export const getMinimumFractionDigitsPrice = (price: number) =>
  Math.max(4 - Math.floor(Math.log10(price)), 0);
