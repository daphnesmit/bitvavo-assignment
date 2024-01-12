import { Ticker24hUpdate } from './bitvavo';

export const calculateChange = (update: Ticker24hUpdate): string => {
  const { ask, bid, open } = update;

  if (!ask || !bid || !open) return '0.00';

  const openFloat = parseFloat(open);
  const midPrice = calculateMidPrice(parseFloat(bid), parseFloat(ask));

  return formatPercentage((midPrice - openFloat) / openFloat);
};

const calculateMidPrice = (bidPrice: number, askPrice: number): number => {
  return (bidPrice + askPrice) / 2;
};

const formatPercentage = (change: number): string => {
  return (change * 100).toFixed(2);
};
