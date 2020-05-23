import Strategy from '../generic';
import { toTick } from './helpers';

describe('Strategy', () => {
  it.each([
    [100, 200, 100],
    [100, 50, -50],
    [100, 110, 10],
    [100, 100, 0],
  ])(
    'should report the right variation %s -> %s of %s%',
    (buy, sell, expected) => {
      const strategy = new Strategy('batman');
      strategy.buy(toTick(buy));
      const sellTick = toTick(sell);
      // Before sell
      expect(strategy.getVariation(sellTick)).toEqual(expected);
      // After sell
      strategy.sell(sellTick);
      expect(strategy.getVariation()).toEqual(expected);
    }
  );
});
