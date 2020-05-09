import WebSocket from 'ws';
import moment from 'moment';
import { Tick } from '../../types';
import { formatTickFromWs } from './helpers';
import { followerLst } from '../models/strategies/listeners';
import { StrategyInstance } from '../models/types';

export const listenTick = (
  symbol: string,
  callback: (tick: Tick, ws: WebSocket) => void
) => {
  const formatedSymbol = symbol.toLowerCase();
  const url = `wss://stream.binance.com:9443/ws/${formatedSymbol}@kline_1m`;
  const ws = new WebSocket(url);

  let now: number;
  ws.on('open', () => {
    now = moment().unix() * 1000;
    console.log('connected', now);
  });

  ws.on('close', () => console.log('disconnected'));

  ws.on('message', (message: string) => {
    const data = JSON.parse(message);
    callback(formatTickFromWs(data), ws);
  });

  ws.on('error', console.error);
  return ws;
};

const simulateBuyNow = (symbol: string) => {
  let strategyInstance: StrategyInstance;
  let tickBought: Tick;
  listenTick(symbol, (tick, ws) => {
    if (tickBought == null) {
      tickBought = tick;
      console.warn('-----BUYING----');
      console.warn(tickBought);
      strategyInstance = followerLst(tickBought, 0.0001);
    }
    const shouldSell = strategyInstance(tick);
    if (shouldSell) {
      console.warn('-----SELLING----');
      console.warn(tick);
      console.warn(
        'Earning: ',
        (tick.close - tickBought.close) / tickBought.close
      );
      ws.close();
    } else {
      const variation =
        (100 * (tick.close - tickBought.close)) / tickBought.close;
      console.log(tick.close, variation);
    }
  });
};
simulateBuyNow('BTCUSDT');
