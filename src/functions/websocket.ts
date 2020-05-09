import WebSocket from 'ws';
import moment from 'moment';

const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@aggTrade');

let now: number;
ws.on('open', () => {
  now = moment().unix() * 1000;
  console.log('connected', now);
});

ws.on('close', () => console.log('disconnected'));

ws.on('message', (message: string) => {
  const data = JSON.parse(message);
  console.log(data);
});

ws.on('error', console.error);
