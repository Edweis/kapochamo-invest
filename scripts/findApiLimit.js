const url =
  'https://www.binance.com/gateway-api/v1/public/market/all?page=1&rows=1';
const https = require('https');
const bottleneck = require('bottleneck');


const ITER = 1000n
const start = process.hrtime.bigint();
const promises = Array(Number(ITER))
  .fill(null)
  .map(() => {
    return new Promise(resolve =>
      https.get(
        'https://www.binance.com/gateway-api/v1/public/market/all?page=1&rows=1',
        data => {
          // console.debug(index);
          if (data.statusCode !== 200) throw Error(data.statusCode);
          resolve();
        }
      )
    );
  });
Promise.all(promises).then(() => {
  const end = process.hrtime.bigint();
  console.debug('All done, time in ms:');
  console.debug((end - start)/ITER / 1000n);
});
