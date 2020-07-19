import { Tick, ApiTick } from '../types';

export const formatTickFromApi = (apiTick: ApiTick): Tick => ({
  openTime: apiTick[0],
  open: apiTick[1],
  high: apiTick[2],
  low: apiTick[3],
  close: apiTick[4],
  volume: apiTick[5],
  closeTime: apiTick[6],
  quoteAssetVolume: apiTick[7],
  numberOfTrades: apiTick[8],
  takerBuyBaseAssetVolume: apiTick[9],
  takerBuyQuoteAssetVolume: apiTick[10],
  ignore: apiTick[11],
});
