import { getOneNews } from '../queries';
import { getPerformanceForNews } from './performance';
import { TEST_OPTIMIST_NEWS_TITLE } from '../../../test-constants';
import { BinanceInfo } from '../../../types';
import {
  followerLst,
  waitLst,
  convertSync,
  highestSync,
} from '../strategies/listeners';

let testNews: BinanceInfo;
describe('getPerformanceForNews', () => {
  const highestPerf = 6.273632581267119;
  beforeAll(async () => {
    testNews = await getOneNews(TEST_OPTIMIST_NEWS_TITLE);
  });
  it('should performe as expected for highestSync', async () => {
    const performances = await getPerformanceForNews(testNews, highestSync);
    expect(performances.BNBUSDT).toEqual(highestPerf);
  });
  it('should performe as expected for wait15Minutes', async () => {
    const strategy = convertSync(waitLst, [15]);
    const performances = await getPerformanceForNews(testNews, strategy);
    expect(performances.BNBUSDT).toEqual(2.987719715962406);
  });
  it('should performe as expected for follower 0.01%', async () => {
    const strategy = convertSync(followerLst, [0.001]);
    const performances = await getPerformanceForNews(testNews, strategy);
    expect(performances.BNBUSDT).toEqual(2.1465754972875244);
  });
  it('should performe as expected for follower 0.1%', async () => {
    const strategy = convertSync(followerLst, [0.01]);
    const performances = await getPerformanceForNews(testNews, strategy);
    expect(performances.BNBUSDT).toEqual(4.29920212214784);
  });
  it('should performe as expected for follower 10%', async () => {
    const strategy = convertSync(followerLst, [0.1]);
    const performances = await getPerformanceForNews(testNews, strategy);
    expect(performances.BNBUSDT).toEqual(highestPerf); // happento be a steady rise
  });
});
