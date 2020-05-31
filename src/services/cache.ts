import { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import qs from 'querystring';

import Bottleneck from 'bottleneck';

type CacheInfo = { fromCache: boolean };
type AxiosResponseCached<T> = Promise<AxiosResponse<T> & CacheInfo>;
type AxiosCache = { [url: string]: Promise<AxiosResponse<any>> };

const BINANCE_REQUEST_LIMIT = 1200;
const LEEWAY = 300;
const limiter = new Bottleneck({
  reservoir: BINANCE_REQUEST_LIMIT - LEEWAY,
  reservoirRefreshAmount: BINANCE_REQUEST_LIMIT - LEEWAY,
  reservoirRefreshInterval: 60 * 1000,
  maxConcurrent: 100,
  minTime: 10,
});

export const formatUrl = (url: string, config?: AxiosRequestConfig) => {
  if (config == null) return url;
  const queryString = qs.stringify(config.params);
  return `${url}?${queryString}`;
};
const cache: AxiosCache = {};
export const axiosCacheGet = (axiosInstance: AxiosInstance) => async <T>(
  url: string,
  config?: AxiosRequestConfig
): AxiosResponseCached<T> => {
  const formatedUrl = formatUrl(url, config);
  if (cache[formatedUrl] == null) {
    const promise = limiter.schedule(() => axiosInstance.get<T>(url, config));
    cache[formatedUrl] = promise;
    return promise.then(result => ({ ...result, fromCache: false }));
  }
  const promise = cache[formatedUrl] as AxiosResponseCached<T>;
  return promise.then(result => ({ ...result, fromCache: true }));
};
