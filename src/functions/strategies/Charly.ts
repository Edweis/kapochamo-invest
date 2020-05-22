import Strategy, { StrategyInterface } from './generic';
import { Tick } from '../../types';
import WaitFor from './WaitFor';
import RelativeFollower from './RelativeFollower';

class Charly extends Strategy implements StrategyInterface {
  private WaitForInstance: StrategyInterface;

  private RelativeFollowerInstance: StrategyInterface;

  constructor(
    waitFor: number,
    sellAfterRelativeLossOf: number,
    pureLossApetite: number
  ) {
    super(
      `charly_S_${sellAfterRelativeLossOf * 100}W${waitFor}L${pureLossApetite *
        100}`
    );
    this.WaitForInstance = new WaitFor(waitFor);
    this.RelativeFollowerInstance = new RelativeFollower(
      sellAfterRelativeLossOf,
      pureLossApetite
    );
  }

  buy = (tick: Tick) => {
    this.WaitForInstance.buy(tick);
    this.RelativeFollowerInstance.buy(tick);
  };

  shouldSell = (tick: Tick) => {
    const didWait = this.WaitForInstance.shouldSell(tick);
    const didFollow = this.RelativeFollowerInstance.shouldSell(tick);
    return didWait && didFollow;
  };
}

export default Charly;
