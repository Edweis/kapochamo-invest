import Follower from '../Follower';
// import { Tick } from '../../../../../types';
import { tickify } from './helpers';

describe('Follower', () => {
  it.each([[new Follower(0.5)], [new Follower(0.1)], [new Follower(0.01)]])(
    'should return false for raising serie - %p',
    strategy => {
      const ticks = tickify([1, 2, 3, 4, 5]);
      const expected = [false, false, false, false, false];
      strategy.buy(ticks[0]);
      expect(ticks.map(strategy.shouldSell)).toEqual(expected);
    }
  );
  it('should sell after 10% loss', () => {
    const strategy = new Follower(0.1);
    const ticks = tickify([100, 95, 90, 80, 75, 81]);
    const expected = [false, false, true, true, true, true];
    strategy.buy(ticks[0]);
    expect(ticks.map(strategy.shouldSell)).toEqual(expected);
  });
  it('should sell after a hill 10%', () => {
    const ticks = tickify([50, 60, 100, 95, 92, 90, 100]);
    const expected = [false, false, false, false, false, true, false];
    const strategy = new Follower(0.1);
    strategy.buy(ticks[0]);
    expect(ticks.map(strategy.shouldSell)).toEqual(expected);
  });
  it.each([
    [new Follower(0.001), 'follower0.1'],
    [new Follower(0.05), 'follower5'],
    [new Follower(0.5), 'follower50'],
  ])('should have the right name', (strategy, name) => {
    expect(strategy.name).toEqual(name);
  });
});
