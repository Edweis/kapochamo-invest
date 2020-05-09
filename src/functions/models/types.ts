import { BinanceInfo, Tick } from '../../types';

export type Asset = string;
export type AssetSymbol = string;

export type Strategy = (ticks: Tick[]) => Tick | null;
export type Extractor = (news: BinanceInfo) => Promise<AssetSymbol[]>;
export type StrategyInstance = (tick: Tick) => boolean;
export type StrategyListener<T extends any[]> = (
  initialTick: Tick,
  ...args: T
) => StrategyInstance;
