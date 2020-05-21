import Strategy, { StrategyInterface } from './generic';
import { checkPercentage } from '../helpers';
import { Tick } from '../../../../types';

type Percentage = number;

class RelativeFollower extends Strategy implements StrategyInterface {
  private sellAfterRelativeLossOf: Percentage;

  private pureLossApetite: Percentage;

  private boughtFor: number;

  private highest: number;

  constructor(
    sellAfterRelativeLossOf: Percentage,
    pureLossApetite: Percentage = 0.2
  ) {
    super(
      `relativeFollower_L${pureLossApetite * 100}_S${sellAfterRelativeLossOf *
        100}`
    );
    checkPercentage(sellAfterRelativeLossOf);
    checkPercentage(pureLossApetite);
    this.sellAfterRelativeLossOf = sellAfterRelativeLossOf;
    this.pureLossApetite = pureLossApetite;
  }

  buy = (tick: Tick) => {
    this.highest = tick.close;
    this.boughtFor = tick.close;
  };

  shouldSell = (tick: Tick) => {
    this.highest = Math.max(this.highest, tick.close);
    const gain = Math.max((tick.close - this.boughtFor) / this.boughtFor, 0);
    const triggerCoef =
      gain === 0
        ? 1 - this.pureLossApetite
        : 1 - gain * this.sellAfterRelativeLossOf;
    return tick.close <= this.highest * triggerCoef;
  };
}

export default RelativeFollower;
