import axios from 'axios';
import crypto from 'crypto';
import qs from 'querystring';
import { axiosCacheGet } from './cache';
import { BINANCE_API_KEY, BINANCE_PRIVATE_KEY } from '../constants';
import { OrderPostFullResponse } from './types';

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
  const params: any = {
    symbol,
    type: 'MARKET',
    recvWindow: 5000,
    timestamp: Date.now(),
    side,
  };
  if (side === 'BUY') params.quoteOrderQty = quantity;
  if (side === 'SELL') params.quantity = quantity;
  const query = qs.stringify(params);
  const signature = sign(query);
  return `${query}&signature=${signature}`;
};

export const getListOrders = async () => {
  const params = qs.stringify({ timestamp: Date.now(), symbol: 'BNBBTC' });
  const signature = sign(params);
  console.debug({ binancePrivate });
  return binancePrivate.get(`/allOrders?${params}&signature=${signature}`);
};

export const sendOrder = (
  side: 'BUY' | 'SELL',
  symbol: string,
  quantity: number
) => {
  const params = getOrderParams(side, symbol, quantity);
  return binancePrivate
    .post<OrderPostFullResponse>(`order?${params}`)
    .catch(error => {
      console.error(error);
      console.error(error?.response?.data);
      throw error;
    });
};
