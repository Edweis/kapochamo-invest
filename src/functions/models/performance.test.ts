import { getOneNews } from './queries';
import { getPerformanceForNews } from './performance';
import { TEST_NEWS_TITLE } from '../../test-constants';
import { BinanceInfo } from '../../types';
import { highestStrategy, wait15Minutes, follower } from './strategy';

let testNews: BinanceInfo;

describe('getPerformanceForNews', () => {
  const highestPerf = 6.435070865609039;
  beforeAll(async () => {
    testNews = await getOneNews(TEST_NEWS_TITLE);
  });
  it('should performe as expected for highestStrategy', async () => {
    const performances = await getPerformanceForNews(testNews, highestStrategy);
    expect(performances.BNBUSDT).toEqual(highestPerf);
  });
  it('should performe as expected for wait15Minutes', async () => {
    const performances = await getPerformanceForNews(testNews, wait15Minutes);
    expect(performances.BNBUSDT).toEqual(3.1478031905208788);
  });
  it('should performe as expected for follower 0.001%', async () => {
    const performances = await getPerformanceForNews(testNews, follower(0.001));
    expect(performances.BNBUSDT).toEqual(3.016724518775646);
  });
  it('should performe as expected for follower 0.01%', async () => {
    const performances = await getPerformanceForNews(testNews, follower(0.01));
    expect(performances.BNBUSDT).toEqual(highestPerf); // happento be a steady rise
  });
});