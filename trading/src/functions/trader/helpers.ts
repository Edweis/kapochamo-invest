import { Tick } from '../../types';

export const formatTickFromWs = (wsTick: any): Tick => ({
  open: wsTick.k.o,
  high: wsTick.k.h,
  low: wsTick.k.l,
  close: wsTick.k.c,
  volume: wsTick.k.v,
  openTime: wsTick.k.t,
  closeTime: wsTick.k.T,
  quoteAssetVolume: wsTick.k.q,
  numberOfTrades: wsTick.k.n,
  takerBuyBaseAssetVolume: wsTick.k.V,
  takerBuyQuoteAssetVolume: wsTick.k.Q,
  ignore: wsTick.k.B,
});
