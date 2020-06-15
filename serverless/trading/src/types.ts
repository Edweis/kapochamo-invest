import BinanceInfoNEXT from './functions/watcher/Info';
import { OrderPostFullResponse } from './services/types';

export type BinanceInfo = BinanceInfoNEXT;

export type ApiTick = number[];
export type Tick = {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
  quoteAssetVolume: number;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: number;
  takerBuyQuoteAssetVolume: number;
  ignore: number;
};

export type LambdaTraderMessage = { [key: string]: any }; // { symbol: string; info: BinanceInfoRaw };

export type SellerMessage = {
  buyResponse: OrderPostFullResponse;
  tries: number;
  highest?: number;
};
