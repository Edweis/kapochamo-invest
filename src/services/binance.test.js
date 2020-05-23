import qs from 'querystring';
import HttpStatus from 'http-status-codes';
import { binancePublic, binancePrivate, sign } from './binance';

const SYMBOL = 'ETHBTC';
describe('should test on public endpoints', () => {
  it('should ping', async () => {
    const result = await binancePublic.get('/ping');
    expect(result.status).toEqual(200);
    expect(result.data).toEqual({});
  });
  it('/time', async () => {
    const result = await binancePublic.get('/time');
    expect(result.status).toEqual(200);
    expect(result.data.serverTime).toBeTruthy();
  });
  it('/exchangeInfo', async () => {
    const result = await binancePublic.get('/exchangeInfo');
    expect(result.status).toEqual(200);
    expect(result.data.symbols).toBeTruthy();
  });
  it('/avgPrice', async () => {
    const params = { symbol: SYMBOL };
    const result = await binancePublic.get('/avgPrice', { params });

    expect(result.status).toEqual(200);
    expect(result.data.mins).toEqual(5);
  });
  it('/depth', async () => {
    const params = { symbol: SYMBOL, limit: 100 };
    const result = await binancePublic.get('/depth', { params });

    expect(result.status).toEqual(200);
    expect(result.data.bids.length).toEqual(100);
  });
  it('/klines', async () => {
    const params = {
      symbol: SYMBOL,
      limit: 1,
      interval: '1m',
      startTime: 1587271070010,
    };
    const expected = [
      1587271080000, // Open time
      '0.02582800', // Open
      '0.02583300', // High
      '0.02582400', // Low
      '0.02583200', // Close
      '99.65300000', // Volume
      1587271139999, // Close time
      '2.57390898', // Quote asset volume
      21, // Number of trades
      '16.91700000', // Taker buy base asset volume
      '0.43693429', // Taker buy quote asset volume
      '0', // Ignore.
    ];
    const result = await binancePublic.get('/klines', { params });

    expect(result.status).toEqual(200);
    expect(result.data).toEqual([expected]);
  });
});

describe('should work for test order', () => {
  it('should sign properly', async () => {
    const params = qs.stringify({
      symbol: 'LTCBTC',
      side: 'BUY',
      type: 'LIMIT',
      timeInForce: 'GTC',
      quantity: 1,
      price: 0.1,
      recvWindow: 5000,
      timestamp: 1499827319559,
    });
    const signature = sign(params);
    expect(signature).toEqual(
      'fb769dffb00b13a7c30245fec08cb0c6006d4c74307e6d818f451645e952c04e'
    );
  });

  it('should create a valid request', async () => {
    const params = qs.stringify({
      symbol: 'BNBBTC',
      side: 'BUY',
      type: 'MARKET',
      quantity: 1,
      recvWindow: 5000,
      timestamp: Date.now(),
    });
    const signature = sign(params);
    const response = await binancePrivate.post(
      `/order/test?${params}&signature=${signature}`
    );

    expect(response.status).toEqual(HttpStatus.OK);
  });
});
