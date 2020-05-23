import moment from 'moment';
import { binancePublicGet } from '../services/binance';

import { AssetSymbol } from './types';
import { ApiTick } from '../types';
import { formatTickFromApi } from './helpers';

type ParamsKLines = {
  symbol: string;
  limit?: number;
  interval: string;
  endTime?: number;
  startTime?: number;
};

const getKlines = async (params: ParamsKLines) =>
  binancePublicGet<ApiTick[]>('/klines', {
    params,
  });

export const getTickAround = async (time: Date, symbol: AssetSymbol) => {
  const INTERVAL = '1m';
  const NUMBER_TICKS = 100;
  const now = moment(time).unix() * 1000;
  const params = { symbol, limit: NUMBER_TICKS, interval: INTERVAL };
  const paramBefore = { ...params, endTime: now };
  const paramAfter = { ...params, startTime: now };
  const ticksBefore = await getKlines(paramBefore);
  const ticksAfter = await getKlines(paramAfter);

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
