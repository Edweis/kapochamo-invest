/* eslint-disable */
// Code to test the latency of several request to choose the AWS region
const https = require('https');

const TRIES = 100;

const urls = [
  'https://www.binance.com/gateway-api/v1/public/market/all?page=1&rows=1',
  'https://api.binance.com/api/v3/ping',
];

const formatTime = (start, end, tries) => {
  const diff = (end - start) / BigInt(tries);
  const ns = diff % 1000n;
  const micro = ((diff - ns) / 1000n) % 1000n;
  const milli = ((diff - ns - micro * 1000n) / 1000000n) % 1000n;
  const sec =
    ((diff - ns - micro * 1000n - milli * 1000000n) / 1000000000n) % 1000n;
  return `${sec.toString()}sec ${milli.toString()}ms ${micro.toString()}μs ${ns.toString()}ns`;
};

const timeUrl = async url => {
  const start = process.hrtime.bigint();
  for (let i = 0; i < TRIES; i++) {
    await new Promise(resolve => {
      https.get(
        'https://www.binance.com/gateway-api/v1/public/market/all?page=1&rows=1',
        data => {
          if (data.statusCode !== 200) throw Error(data.statusCode);
          return resolve();
        }
      );
    });
  }
  const end = process.hrtime.bigint();
  return formatTime(start, end, TRIES);
};
exports.handler = async event => {
  const res = {};
  for (url in urls) {
    res[url] = await timeUrl(url);
  }
  return res;
};
