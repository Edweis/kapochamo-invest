import WaitFor from '../WaitFor';
import { Tick } from '../../../types';
import { tickify } from './helpers';

const timeTicks = (ticks: Tick[]) =>
  ticks.map((tick, index) => ({ ...tick, openTime: index * 60 * 1000 }));

describe('waitLst', () => {
  const ticks = timeTicks(tickify([0, 1, 2, 3, 4]));
  it('should wait for 3 ticks', () => {
    const strategy = new WaitFor(3);
    strategy.buy(ticks[0]);
    expect(strategy.shouldSell(ticks[1])).toEqual(false);
    expect(strategy.shouldSell(ticks[2])).toEqual(false);
    expect(strategy.shouldSell(ticks[3])).toEqual(true);
    expect(strategy.shouldSell(ticks[4])).toEqual(true);
  });
  it('should wait for 0 ticks', () => {
    const strategy = new WaitFor(0);
    strategy.buy(ticks[0]);
    expect(strategy.shouldSell(ticks[1])).toEqual(true);
    expect(strategy.shouldSell(ticks[2])).toEqual(true);
    expect(strategy.shouldSell(ticks[3])).toEqual(true);
    expect(strategy.shouldSell(ticks[4])).toEqual(true);
  });
});
