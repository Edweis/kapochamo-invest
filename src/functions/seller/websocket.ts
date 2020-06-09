import WebSocket from 'ws';
import { Tick } from '../../types';
import { formatTickFromWs } from './helpers';

export const listenTick = async (
  symbol: string,
  callback: (tick: Tick, done: () => void) => Promise<void>
) => {
  const formatedSymbol = symbol.toLowerCase();
  const url = `wss://stream.binance.com:9443/ws/${formatedSymbol}@kline_1m`;
  const ws = new WebSocket(url);

  ws.on('open', () => console.log(`connected to ${ws.url}`, Date.now()));
  ws.on('close', () => console.log(`disconnected from ${ws.url}`));

  await new Promise<void>((resolve, reject) => {
    ws.on('error', error => reject(error));
    ws.on('message', async (message: string) => {
      const tick = formatTickFromWs(message);
      await callback(tick, resolve);
    });
  });
  ws.close();
};
