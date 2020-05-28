import { getPerformanceForNews } from './performance';
import { TEST_OPTIMIST_NEWS } from '../../test-constants';
import { Follower, WaitFor, Highest } from '../../functions/strategies';

const testNews = TEST_OPTIMIST_NEWS;
describe('getPerformanceForNews', () => {
  const highestPerf = 6.273632581267119;
  it('should performe as expected for highestSync', async () => {
    const performances = await getPerformanceForNews(testNews, new Highest());
    expect(performances.BNBUSDT).toEqual(highestPerf);
  });
  it('should performe as expected for wait15Minutes', async () => {
    const strategy = new WaitFor(15);
    const performances = await getPerformanceForNews(testNews, strategy);
    expect(performances.BNBUSDT).toEqual(2.987719715962406);
  });
  it('should performe as expected for follower 0.01%', async () => {
    const strategy = new Follower(0.001);
    const performances = await getPerformanceForNews(testNews, strategy);
    expect(performances.BNBUSDT).toEqual(1.764316105973785);
  });
  it('should performe as expected for follower 0.1%', async () => {
    const strategy = new Follower(0.01);
    const performances = await getPerformanceForNews(testNews, strategy);
    expect(performances.BNBUSDT).toEqual(4.097561853600448);
  });
  it('should performe as expected for follower 10%', async () => {
    const strategy = new Follower(0.1);
    const performances = await getPerformanceForNews(testNews, strategy);
    expect(performances.BNBUSDT).toEqual(null); // happen to be a steady rise, never sell
  });
});
