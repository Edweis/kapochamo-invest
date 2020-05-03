import moment from 'moment';
import { binancePublic } from '../../api';

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
  const ticksBefore = await binancePublic.get<ApiTick[]>('/klines', {
    params: paramBefore,
  });
  const ticksAfter = await binancePublic.get<ApiTick[]>('/klines', {
    params: paramAfter,
  });
  const allTicks = ticksBefore.data.concat(ticksAfter.data);

  // Sometime the API goes beyonf the required date, we filter out theses
  const later = now + NUMBER_TICKS * 60 * 1000;
  const earlier = now - NUMBER_TICKS * 60 * 1000;

  return allTicks
    .map(formatTickFromApi)
    .filter(tick => earlier <= tick.openTime && tick.openTime <= later);
};
