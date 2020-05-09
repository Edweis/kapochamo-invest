import { getOneNews } from '../queries';
import { getPerformanceForNews } from './performance';
import { TEST_OPTIMIST_NEWS_TITLE } from '../../../test-constants';
import { BinanceInfo } from '../../../types';
import { highestStrategy, wait15Minutes, follower } from '../strategies';

let testNews: BinanceInfo;

describe('getPerformanceForNews', () => {
  const highestPerf = 6.273632581267119;
  beforeAll(async () => {
    testNews = await getOneNews(TEST_OPTIMIST_NEWS_TITLE);
  });
  it('should performe as expected for highestStrategy', async () => {
    const performances = await getPerformanceForNews(testNews, highestStrategy);
    expect(performances.BNBUSDT).toEqual(highestPerf);
  });
  it('should performe as expected for wait15Minutes', async () => {
    const performances = await getPerformanceForNews(testNews, wait15Minutes);
    expect(performances.BNBUSDT).toEqual(2.987719715962406);
  });
  it('should performe as expected for follower 0.01%', async () => {
    const performances = await getPerformanceForNews(testNews, follower(0.001));
    expect(performances.BNBUSDT).toEqual(2.1465754972875244);
  });
  it('should performe as expected for follower 0.1%', async () => {
    const performances = await getPerformanceForNews(testNews, follower(0.01));
    expect(performances.BNBUSDT).toEqual(4.29920212214784);
  });
  it('should performe as expected for follower 10%', async () => {
    const performances = await getPerformanceForNews(testNews, follower(0.1));
    expect(performances.BNBUSDT).toEqual(highestPerf); // happento be a steady rise
  });
});
