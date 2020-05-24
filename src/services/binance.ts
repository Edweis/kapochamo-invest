import axios from 'axios';
import crypto from 'crypto';
import qs from 'querystring';
import { axiosCacheGet } from './cache';
import { BINANCE_API_KEY, BINANCE_PRIVATE_KEY } from '../constants';

const BASE_URL = 'https://api.binance.com/api/v3';

export const binancePrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-MBX-APIKEY': BINANCE_API_KEY,
    'Content-Type': 'application/json',
  },
});

export const sign = (queryString: string) =>
  crypto
    .createHmac('sha256', BINANCE_PRIVATE_KEY)
    .update(queryString)
    .digest('hex');

export const binancePublic = axios.create({ baseURL: BASE_URL });

export const binancePublicGet = axiosCacheGet(binancePublic);

export const getOrderParams = (
  side: 'BUY' | 'SELL',
  symbol: string,
  quantity: number
) => {
  const params = qs.stringify({
    symbol,
    type: 'MARKET',
    quantity,
    recvWindow: 5000,
    timestamp: Date.now(),
    side,
  });
  const signature = sign(params);
  return `${params}&signature=${signature}`;
};
