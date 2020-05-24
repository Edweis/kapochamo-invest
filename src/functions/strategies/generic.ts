import { Tick } from '../../types';
import { isTest } from '../../constants';
import Order from '../order';

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

  order: Order | null = null;

  constructor(name: string) {
    super();
    this.name = name;
  }

  toString() {
    return this.name;
  }

  setOrder = (order: Order) => {
    this.order = order;
  };

  buy = (tick: Tick) => {
    logTransaction('-----BUYING----');
    logTransaction(tick);
    this.boughtTick = tick;
    this.didBuy = true;
    if (this.init != null) this.init(tick);
    if (this.order != null) return this.order.buy();
    return Promise.resolve(); // We can't use async func class property. This is a trick
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
    if (this.order != null) return this.order.sell();
    return Promise.resolve(); // We can't use async func class property. This is a trick
  };
}

export default Strategy;
