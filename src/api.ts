import axios from 'axios';
import { axiosCacheGet } from './services/cache';

const BASE_URL = 'https://api.binance.com/api/v3';

export const binancePrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-MBX-APIKEY':
      'vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A',
  },
});

export const binancePublic = axios.create({ baseURL: BASE_URL });

export const binancePublicGet = axiosCacheGet(binancePublic);
