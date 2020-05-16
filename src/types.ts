export type BinanceInfo = {
  title: string;
  content: string;
  time: Date;
  url: string;
};

export type BinanceInfoRaw = {
  title: string | null;
  text: string | null;
  time: string | null;
  url: string;
};

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
