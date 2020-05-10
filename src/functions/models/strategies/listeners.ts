import _ from 'lodash';
import { StrategyListener, StrategyInstance, Strategy } from '../types';
import { rename, checkPercentage } from './helpers';

type Percentage = number;
export const followerLst: StrategyListener<[Percentage]> = (
  initialTick,
  sellAfterLossOf
) => {
  checkPercentage(sellAfterLossOf);
  let highest = initialTick.close;
  const strategy: StrategyInstance = tick => {
    highest = Math.max(highest, tick.close);
    return tick.close <= highest * (1 - sellAfterLossOf);
  };
  const functionName = `follower${sellAfterLossOf * 100}`;
  return rename(strategy, functionName);
};

export const relativeFollower: StrategyListener<[Percentage, Percentage]> = (
  initialTick,
  sellAfterRelativeLossOf,
  pureLossApetite
) => {
  checkPercentage(sellAfterRelativeLossOf);
  checkPercentage(pureLossApetite);
  let highest = initialTick.close;
  const boughtFor = initialTick.close;
  const strategy: StrategyInstance = tick => {
    highest = Math.max(highest, tick.close);
    const gain = Math.max((tick.close - boughtFor) / boughtFor, 0);
    const triggerCoef =
      gain === 0 ? 1 - pureLossApetite : 1 - gain * sellAfterRelativeLossOf;
    return tick.close <= highest * triggerCoef;
  };

  const functionName = `relativeFollower_L${pureLossApetite *
    100}_S${sellAfterRelativeLossOf * 100}`;
  return rename(strategy, functionName);
};

export const waitLst: StrategyListener<[number]> = (
  initialTick,
  waitForMin
) => {
  const startedAt = initialTick.openTime;
  const endAt = startedAt + waitForMin * 60 * 1000;

  const strategy: StrategyInstance = tick => tick.openTime >= endAt;
  const functionName = `waitFor${waitForMin}`;
  return rename(strategy, functionName);
};

export const charly: StrategyListener<[number, Percentage, Percentage]> = (
  initialTick,
  waitFor,
  sellAfterRelativeLossOf,
  pureLossApetite
) => {
  const functionName = `charly_S_${sellAfterRelativeLossOf *
    100}W${waitFor}L${pureLossApetite * 100}`;
  const waitForInstance = waitLst(initialTick, waitFor);
  const followerInstance = relativeFollower(
    initialTick,
    pureLossApetite,
    sellAfterRelativeLossOf
  );
  const strategy: StrategyInstance = tick => {
    const hasWaited = waitForInstance(tick);
    const shouldSell = followerInstance(tick);
    return hasWaited && shouldSell;
  };
  return rename(strategy, functionName);
};

export const highestSync: Strategy = ticks =>
  _.maxBy(ticks, 'close') || ticks[0];

// All of these function are meant to be called by a web socket
// This function convert the event base function for websocket into strategy that accept an array of tick as input
export const convertSync = <K extends any[]>(
  strategy: StrategyListener<K>,
  args: K
): Strategy => {
  let strategyInstance: StrategyInstance | null = null;
  // eslint-disable-next-line
  // @ts-ignore Ugly but I just want the name of the function to pass to the wrapper !
  const { name } = strategy({}, ...args);
  const strategySync: Strategy = ticks => {
    if (strategyInstance == null) {
      strategyInstance = strategy(ticks[0], ...args);
    }
    return ticks.find(strategyInstance) || _.last(ticks) || ticks[0];
  };

  return rename(strategySync, name);
};