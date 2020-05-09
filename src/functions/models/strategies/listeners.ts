import { StrategyListener } from '../types';

export const followerLst: StrategyListener<number> = (
  initialTick,
  sellAfterLossOf: number
) => {
  let highest = initialTick.open;
  return tick => {
    highest = Math.max(highest, tick.open);
    return tick.open <= highest * (1 - sellAfterLossOf);
  };
};
