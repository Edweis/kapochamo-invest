import moment from 'moment';
import { binancePublicGet } from '../../api';

import { AssetSymbol, ApiTick, Tick } from './types';
const formatTickFromApi = (apiTick: ApiTick): Tick => ({
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

export const getTickAround = async (time: Date, symbol: AssetSymbol) => {
  const INTERVAL = '1m';
  const NUMBER_TICKS = 100;
  const now = moment(time).unix() * 1000;
  const params = { symbol, limit: NUMBER_TICKS, interval: INTERVAL };
  const paramBefore = { ...params, endTime: now };
  const paramAfter = { ...params, startTime: now };
  const ticksBefore = await binancePublicGet<ApiTick[]>('/klines', {
    params: paramBefore,
  });
  const ticksAfter = await binancePublicGet<ApiTick[]>('/klines', {
    params: paramAfter,
  });

  // Sometime the API goes beyonf the required date, we filter out theses
  const later = now + NUMBER_TICKS * 60 * 1000;
  const earlier = now - NUMBER_TICKS * 60 * 1000;
  const ticksAfterFiltered = ticksAfter.data
    .map(formatTickFromApi)
    .filter(tick => tick.openTime <= later);
  const ticksBeforeFiltered = ticksBefore.data
    .map(formatTickFromApi)
    .filter(tick => earlier <= tick.openTime);

  // We abord when we don't have all ticks (like when the crypto does not exists yet)
  if (ticksAfterFiltered.length !== NUMBER_TICKS) return [];

  const allTicks = ticksBeforeFiltered.concat(ticksAfterFiltered);
  return allTicks;
};
