import { Tick } from '../../types';

export const formatTickFromWs = (wsTick: any): Tick => {
  const tick = JSON.parse(wsTick);
  return {
    open: tick.k.o,
    high: tick.k.h,
    low: tick.k.l,
    close: tick.k.c,
    volume: tick.k.v,
    openTime: tick.k.t,
    closeTime: tick.k.T,
    quoteAssetVolume: tick.k.q,
    numberOfTrades: tick.k.n,
    takerBuyBaseAssetVolume: tick.k.V,
    takerBuyQuoteAssetVolume: tick.k.Q,
    ignore: tick.k.B,
  };
};
