import qs from 'querystring';
import HttpStatus from 'http-status-codes';
import { binancePublic, binancePrivate, getOrderParams } from './binance';

// Mock date

describe('should test on public endpoints', () => {
  const SYMBOL = 'ETHBTC';
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
  it('should create a valid request', async () => {
    const params = getOrderParams('BUY', 'BNBBTC', 1);
    const response = await binancePrivate.post(`/order/test?${params}`);
    expect(response.status).toEqual(HttpStatus.OK);
  });

  it('should sign properly', async () => {
    const STATIC_TIMESTAMP = 1590230294773;
    Date.now = jest.fn(() => STATIC_TIMESTAMP);
    const params = getOrderParams('BUY', 'LTCBTC', 1);
    expect(qs.parse(params)).toEqual({
      quantity: '1',
      recvWindow: '5000',
      side: 'BUY',
      signature:
        '13324a08644cd38f12b3054f4f4188acac78860b8d18e4aa1110fdaadd4e2a52',
      symbol: 'LTCBTC',
      timestamp: STATIC_TIMESTAMP.toString(),
      type: 'MARKET',
    });
  });
});
