import { binancePublic } from './api';

const SYMBOL = 'ETHBTC';
const handleError = error => console.error(error.response.data);
describe('should test on public endpoints', () => {
  it('should ping', async () => {
    const result = await binancePublic.get('/ping').catch(handleError);
    expect(result.status).toEqual(200);
    expect(result.data).toEqual({});
  });
  it('/time', async () => {
    const result = await binancePublic.get('/time').catch(handleError);
    expect(result.status).toEqual(200);
    expect(result.data.serverTime).toBeTruthy();
  });
  it('/exchangeInfo', async () => {
    const result = await binancePublic.get('/exchangeInfo').catch(handleError);
    expect(result.status).toEqual(200);
    expect(result.data).toBeTruthy();
  });
  it('/avgPrice', async () => {
    const params = { symbol: SYMBOL };
    const result = await binancePublic
      .get('/avgPrice', { params })
      .catch(handleError);
    expect(result.status).toEqual(200);
    expect(result.data.mins).toEqual(5);
  });
  it('/depth', async () => {
    const params = { symbol: SYMBOL, limit: 100 };
    const result = await binancePublic
      .get('/depth', { params })
      .catch(handleError);
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
    const result = await binancePublic
      .get('/klines', { params })
      .catch(handleError);
    expect(result.status).toEqual(200);
    expect(result.data).toEqual([expected]);
  });
});
