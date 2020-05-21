import { Tick } from '../../../../types';

export const toTick = (num: number): Tick => ({
  openTime: num,
  open: num,
  high: num,
  low: num,
  close: num,
  volume: num,
  closeTime: num,
  quoteAssetVolume: num,
  numberOfTrades: num,
  takerBuyBaseAssetVolume: num,
  takerBuyQuoteAssetVolume: num,
  ignore: num,
});
export const tickify = (nums: number[]): Tick[] => nums.map(toTick);
