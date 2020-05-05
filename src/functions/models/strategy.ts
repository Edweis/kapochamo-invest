import _ from 'lodash';
import { Strategy, Tick } from './types';
type Percentage = number;

export const highestStrategy: Strategy = ticks =>
  _.maxBy(ticks, 'close') || ticks[0];

export const wait15Minutes: Strategy = ticks => ticks[15] || null;

export const getPeakTicks = (ticks: Tick[]): number[] => {
  let highestTick = ticks[0].low;
  return ticks.map(tick => {
    if (tick.low > highestTick) highestTick = tick.low;
    return highestTick;
  });
};

const checkPercentage = (num: number) => {
  if (num > 1 || num < 0) throw Error(num + ' should be a percentage');
};
const rename = <T extends Function>(fn: T, name: string): T => {
  const formatedName = name.replace('.', '_');
  return new Function(
    'fn',
    'return (function ' +
      formatedName +
      '(){\n  return fn.apply(this, arguments)\n});'
  )(fn);
};

export const follower = (sellAfterLossOf: Percentage): Strategy => {
  checkPercentage(sellAfterLossOf);
  const functionName = 'follower' + sellAfterLossOf * 100;
  const strategyFunc: Strategy = ticks => {
    console.debug(
      'Following',
      ticks.map(tick => tick.open)
    );
    const peakValues = getPeakTicks(ticks);
    const tickToSell = ticks.find((tick, index) => {
      const peak = peakValues[index];
      return tick.open <= peak * (1 - sellAfterLossOf);
    });
    return tickToSell || _.last(ticks) || null;
  };
  return rename(strategyFunc, functionName);
};
