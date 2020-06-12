import HttpStatus from 'http-status-codes';
import nunjucks from 'nunjucks';
import { binancePublic } from '../../services/binance';
import template from './template.html';

nunjucks.configure({ autoescape: false });
console.debug(template.length);

const DEFAULT = {
  TIME: 1587271070010,
  SYMBOL: 'BNBUSDT',
  LIMIT: 90,
};
const handler = async (event: AWSLambda.APIGatewayEvent) => {
  const queryString = event.queryStringParameters;
  const time = queryString?.time ?? DEFAULT.TIME;
  const symbol = queryString?.symbol ?? DEFAULT.SYMBOL;
  const limit = queryString?.limit ?? DEFAULT.LIMIT;
  const params = {
    interval: '1m',
    startTime: time,
    symbol,
    limit,
  };

  const response = await binancePublic.get('klines', { params });
  const formatedTicks = response.data.map((tick: any) => ({
    x: tick[0],
    y: tick.splice(1, 4),
  }));
  console.debug(formatedTicks);
  const page = nunjucks.renderString(template, {
    data: JSON.stringify(formatedTicks),
    time,
    symbol,
    limit,
  });
  return {
    statusCode: HttpStatus.OK,
    headers: { 'Content-Type': 'text/html' },
    body: page,
  };
};

export default handler;
