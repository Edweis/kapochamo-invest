import { Tick } from '../types';
import BinanceInfoNEXT from './watcher/Info';

export type Asset = string;
export type AssetSymbol = string;

export type Strategy = (ticks: Tick[]) => Tick | null;
export type Extractor = (news: BinanceInfoNEXT) => Promise<AssetSymbol[]>;
export type StrategyInstance = (tick: Tick) => boolean;
export type StrategyListener<T extends any[]> = (
  initialTick: Tick,
  ...args: T
) => StrategyInstance;
