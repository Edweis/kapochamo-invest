import { Tick } from '../../types';
import { isTest } from '../../constants';

export interface StrategyInterface extends Strategy {
  init: (tick: Tick) => void;
  shouldSell: (tick: Tick) => boolean;
}

const logTransaction = (message: any) => {
  if (!isTest) console.log(message);
};

class Strategy extends Object {
  name: string;

  didBuy = false;

  boughtTick: Tick;

  soldTick: Tick;

  shouldSell: (tick: Tick) => boolean;

  init: (tick: Tick) => void;

  constructor(name: string) {
    super();
    this.name = name;
  }

  toString() {
    return this.name;
  }

  buy = (tick: Tick) => {
    this.boughtTick = tick;
    this.didBuy = true;
    logTransaction('-----BUYING----');
    logTransaction(tick);
    if (this.init != null) this.init(tick);
  };

  getVariation = (tick?: Tick) => {
    const tickToCompare = tick ?? this.soldTick;
    if (tickToCompare == null) throw new Error('No tick to compare to');
    if (this.boughtTick == null) throw new Error('No tick bought');
    return (
      (100 * (tickToCompare.close - this.boughtTick.close)) /
      this.boughtTick.close
    );
  };

  sell = (tick: Tick) => {
    logTransaction('-----SELLING----');
    logTransaction(tick);
    this.soldTick = tick;
  };
}

// TODOOOO IMPLEMENT VARIATION, stopTrading(). GENRIC SHOULD BE AWARE OF BUYING TICK
// IT CAN ALSO COMPUTE VARIATION ON SELL, TAKING FEES INTO ACCOUNT
// ALSO CHECH THAT BUY HAPPENED BEFORE SELL
export default Strategy;
