import BinanceInfoNEXT from './functions/watcher/Info';

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

export type LambdaTraderPayload = { [key: string]: any }; // { symbol: string; info: BinanceInfoRaw };
