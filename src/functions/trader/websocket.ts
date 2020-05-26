import WebSocket from 'ws';
import moment from 'moment';
import { Tick } from '../../types';
import { formatTickFromWs } from './helpers';

export const listenTick = async <T>(
  symbol: string,
  callback: (
    tick: Tick,
    ws: WebSocket,
    resolveWs: (value: T) => void
  ) => Promise<void>
): Promise<T> => {
  const formatedSymbol = symbol.toLowerCase();
  const url = `wss://stream.binance.com:9443/ws/${formatedSymbol}@kline_1m`;
  const ws = new WebSocket(url);

  let now: number;

  ws.on('open', () => {
    now = moment().unix() * 1000;
    console.log(`connected to ${ws.url}`, now);
  });
  ws.on('close', () => console.log(`disconnected from ${ws.url}`));

  return new Promise((resolve, reject) => {
    ws.on('error', error => {
      console.error(error);
      reject(error);
    });
    ws.on('message', async (message: string) => {
      const data = JSON.parse(message);
      await callback(formatTickFromWs(data), ws, resolve);
    });
  });
};
