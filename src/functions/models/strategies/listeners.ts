import { StrategyListener, Tick } from '../types';
import { rename } from './helpers';

export const followerLst: StrategyListener<number> = (
  initialTick,
  sellAfterLossOf: number
) => {
  let highest = initialTick.open;
  const functionName = 'follower' + sellAfterLossOf * 100;
  const strategy = (tick: Tick) => {
    highest = Math.max(highest, tick.open);
    return tick.open <= highest * (1 - sellAfterLossOf);
  };
  return rename(strategy, functionName);
};
