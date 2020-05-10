import WebSocket from 'ws';
import moment from 'moment';
import { Tick } from '../../types';
import { formatTickFromWs } from './helpers';

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
    console.log(`connected to ${ws}`, now);
  });

  ws.on('close', () => console.log(`disconnected from ${ws}`));

  ws.on('message', (message: string) => {
    const data = JSON.parse(message);
    callback(formatTickFromWs(data), ws);
  });

  ws.on('error', console.error);
  return ws;
};
