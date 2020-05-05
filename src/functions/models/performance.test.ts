import { getOneNews } from './queries';
import { getPerformanceForNews } from './performance';
import { TEST_OPTIMIST_NEWS_TITLE } from '../../test-constants';
import { BinanceInfo } from '../../types';
import { highestStrategy, wait15Minutes, follower } from './strategy';

let testNews: BinanceInfo;

describe('getPerformanceForNews', () => {
  const highestPerf = 6.473632581267119;
  beforeAll(async () => {
    testNews = await getOneNews(TEST_OPTIMIST_NEWS_TITLE);
  });
  it('should performe as expected for highestStrategy', async () => {
    const performances = await getPerformanceForNews(testNews, highestStrategy);
    expect(performances.BNBUSDT).toEqual(highestPerf);
  });
  it('should performe as expected for wait15Minutes', async () => {
    const performances = await getPerformanceForNews(testNews, wait15Minutes);
    expect(performances.BNBUSDT).toEqual(3.1877197159624058);
  });
  it('should performe as expected for follower 0.001%', async () => {
    const performances = await getPerformanceForNews(testNews, follower(0.001));
    expect(performances.BNBUSDT).toEqual(3.0566950667928907);
  });
  it('should performe as expected for follower 0.01%', async () => {
    const performances = await getPerformanceForNews(testNews, follower(0.01));
    expect(performances.BNBUSDT).toEqual(highestPerf); // happento be a steady rise
  });
});
