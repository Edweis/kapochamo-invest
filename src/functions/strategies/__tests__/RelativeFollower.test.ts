import RelativeFollower from '../RelativeFollower';
// import { Tick } from '../../../../../types';
import { tickify } from './helpers';

describe('waitLst', () => {
  it.each([
    [new RelativeFollower(0.5)],
    [new RelativeFollower(0.1)],
    [new RelativeFollower(0.01)],
  ])('should return false for raising serie - %p', strategy => {
    const ticks = tickify([1, 2, 3, 4, 5]);
    const expected = [false, false, false, false, false];
    strategy.buy(ticks[0]);
    expect(ticks.map(strategy.shouldSell)).toEqual(expected);
  });
  it('should sell after 5% loss', () => {
    const ticks = tickify([100, 99, 95, 84, 76]);
    const strategy = new RelativeFollower(0.1, 0.05);
    const expected = [false, false, true, true, true];
    strategy.buy(ticks[0]);
    expect(ticks.map(strategy.shouldSell)).toEqual(expected);
  });
  it('should sell after a hill 100% -> sell at -10%', () => {
    const ticks = tickify([50, 60, 100, 95, 92, 90, 100]);
    const strategy = new RelativeFollower(0.1, 0.05);
    const expected = [false, false, false, false, false, true, false];
    strategy.buy(ticks[0]);
    expect(ticks.map(strategy.shouldSell)).toEqual(expected);
  });
  it.each([
    [new RelativeFollower(0.5, 0.2), 'relativeFollower_L20_S50'],
    [new RelativeFollower(0.1, 0.1), 'relativeFollower_L10_S10'],
    [new RelativeFollower(0.001, 0.08), 'relativeFollower_L8_S0.1'],
  ])('should have the right name', (strategy, name) => {
    expect(strategy.name).toEqual(name);
  });
});
