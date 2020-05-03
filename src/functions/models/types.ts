export type Asset = string;
export type AssetSymbol = string;
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
export type Strategy = (ticks: Tick[]) => Tick | null;
