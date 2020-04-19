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
});
