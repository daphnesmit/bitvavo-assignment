import { Ticker24hData } from '../../../utils/queries';

export const updateTicker24Data = (oldData: Ticker24hData[], newData: Ticker24hData[]) => {
  return oldData.map((item) => {
    const updatedItem = newData.find((newItem) => newItem.market === item.market);
    if (updatedItem) {
      return updatedItem;
    }
    return item;
  });
};
