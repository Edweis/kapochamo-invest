import { BinanceInfo, Tick } from '../types';

export type Asset = string;
export type AssetSymbol = string;

export type Strategy = (ticks: Tick[]) => Tick | null;
export type Extractor = (news: BinanceInfo) => Promise<AssetSymbol[]>;
export type StrategyInstance = (tick: Tick) => boolean;
export type StrategyListener<T extends any[]> = (
  initialTick: Tick,
  ...args: T
) => StrategyInstance;

//
// TODOOOOOOOOOO REMOVE WHAT IS USELESS &&& RUN MORE LAMBDAS / minutes
//  -> create EC2 instance
//
//  curl \
//   -H 'Authorization: token 032844d26748019dd4d21241ff9e46510bf874bd'   \
//   -H 'Accept: application/vnd.github.v3.raw' \
//   -L 'https://raw.githubusercontent.com/Edweis/kapochamo-invest/master/src/testPing.js'
