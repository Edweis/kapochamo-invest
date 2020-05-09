import { StrategyListener, StrategyInstance } from '../types';
import { rename, checkPercentage } from './helpers';

type Percentage = number;
export const followerLst: StrategyListener<[Percentage]> = (
  initialTick,
  sellAfterLossOf
) => {
  checkPercentage(sellAfterLossOf);
  let highest = initialTick.open;
  const strategy: StrategyInstance = tick => {
    highest = Math.max(highest, tick.open);
    return tick.open <= highest * (1 - sellAfterLossOf);
  };
  const functionName = 'follower' + sellAfterLossOf * 100;
  return rename(strategy, functionName);
};

export const relativeFollower: StrategyListener<[Percentage, Percentage]> = (
  initialTick,
  sellAfterRelativeLossOf,
  pureLossApetite
) => {
  checkPercentage(sellAfterRelativeLossOf);
  checkPercentage(pureLossApetite);
  let highest = initialTick.open;
  const boughtFor = initialTick.open;
  const strategy: StrategyInstance = tick => {
    highest = Math.max(highest, tick.open);
    const gain = Math.max((tick.open - boughtFor) / boughtFor, 0);
    const triggerCoef =
      gain === 0 ? 1 - pureLossApetite : 1 - gain * sellAfterRelativeLossOf;
    return tick.open <= highest * triggerCoef;
  };
  const functionName =
    'relativeFollower_L' +
    pureLossApetite * 100 +
    '_S' +
    sellAfterRelativeLossOf * 100;
  return rename(strategy, functionName);
};

export const waitLst: StrategyListener<[number]> = (
  initialTick,
  waitForMin
) => {
  const startedAt = initialTick.openTime;
  const endAt = startedAt + waitForMin * 60 * 1000;

  const strategy: StrategyInstance = tick => tick.openTime >= endAt;
  const functionName = 'waitFor' + waitForMin;
  return rename(strategy, functionName);
};

export const charly: StrategyListener<[number, Percentage, Percentage]> = (
  initialTick,
  waitFor,
  sellAfterRelativeLossOf,
  pureLossApetite
) => {
  const functionName =
    'charly_S' +
    sellAfterRelativeLossOf * 100 +
    'W' +
    waitFor +
    'L' +
    pureLossApetite * 100;
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
