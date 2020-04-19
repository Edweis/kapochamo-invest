import axios from 'axios';

const BASE_URL = 'https://api.binance.com/api/v3';

const binancePrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-MBX-APIKEY':
      'vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A',
  },
});
const binancePublic = axios.create({
  baseURL: BASE_URL,
});

module.exports = { binancePrivate, binancePublic };
