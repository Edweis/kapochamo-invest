import { axiosCacheGet, formatUrl } from './cache';
import axios from 'axios';

const getter = axiosCacheGet(axios);
describe('axiosCacheGet', () => {
  it('should no cache the first request', async () => {
    const response = await getter<Response>('http://httpstat.us/200');
    expect(response.fromCache).toEqual(false);
  });
  it('second and third requests should be cached', async () => {
    const response2 = await getter<Response>('http://httpstat.us/200');
    const response3 = await getter<Response>('http://httpstat.us/200');
    expect(response2.fromCache).toEqual(true);
    expect(response3.fromCache).toEqual(true);
  });
  it('other requests should not be cached', async () => {
    const response4 = await getter<Response>('http://httpstat.us/200?param=1');
    expect(response4.fromCache).toEqual(false);
  });
  it('should fail 400', async () => {
    expect.assertions(1);
    await getter<Response>('http://httpstat.us/400').catch(err => {
      expect(err.response.status).toEqual(400);
    });
  });
  it('should with config should be cached', async () => {
    const config = { params: { xxx: 'xxx' } };
    const response1 = await getter<Response>('http://httpstat.us/200', config);
    const response2 = await getter<Response>('http://httpstat.us/200', config);
    expect(response1.fromCache).toEqual(false);
    expect(response2.fromCache).toEqual(true);
  });
});

describe('formatUrl', () => {
  it('should format', () => {
    const params = { xxx: 'yyy' };
    expect(formatUrl('aaa', { params })).toEqual('aaa?xxx=yyy');
  });
});
