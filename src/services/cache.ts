import { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
type CacheInfo = { fromCache: boolean };
type AxiosResponseCached<T> = Promise<AxiosResponse<T> & CacheInfo>;
type AxiosCache = { [url: string]: Promise<AxiosResponse<any>> };
import qs from 'querystring';

export const formatUrl = (url: string, config?: AxiosRequestConfig) => {
  if (config == null) return url;
  const queryString = qs.stringify(config.params);
  return url + '?' + queryString;
};
const cache: AxiosCache = {};
export const axiosCacheGet = (axiosInstance: AxiosInstance) => async <T>(
  url: string,
  config?: AxiosRequestConfig
): AxiosResponseCached<T> => {
  const formatedUrl = formatUrl(url, config);
  if (cache[formatedUrl] == null) {
    const promise = axiosInstance.get<T>(url, config);
    cache[formatedUrl] = promise;
    return promise.then(result => ({ ...result, fromCache: false }));
  }
  const promise = cache[formatedUrl] as AxiosResponseCached<T>;
  return promise.then(result => ({ ...result, fromCache: true })).then();
};
