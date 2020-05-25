import Winner from '../Winner';
import { tickify } from './helpers';

describe('Follower', () => {
  it('should return false for raising serie', () => {
    const strategy = new Winner(0.1, 0.2);
    const ticks = tickify([100, 105, 110, 120]);
    const expected = [false, false, true, true];
    strategy.buy(ticks[0]);
    expect(ticks.map(strategy.shouldSell)).toEqual(expected);
  });
  it('should sell after 10% loss', () => {
    const strategy = new Winner(0.2, 0.1);
    const ticks = tickify([100, 95, 90, 80, 75, 81]);
    const expected = [false, false, true, true, true, true];
    strategy.buy(ticks[0]);
    expect(ticks.map(strategy.shouldSell)).toEqual(expected);
  });
  it.each([
    [new Winner(0.001, 0.5), 'Winner0.001_L50'],
    [new Winner(0.05, 0.1), 'Winner0.05_L10'],
    [new Winner(0.5, 0.001), 'Winner0.5_L0.1'],
  ])('should have the right name', (strategy, name) => {
    expect(strategy.name).toEqual(name);
  });
});
