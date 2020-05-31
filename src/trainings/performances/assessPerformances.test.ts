import _ from 'lodash';
import pLimit from 'p-limit';
import { getNews } from '../queries';
import { clearPerformances } from './export';
import { getPerformanceForNews } from './performance';
import { BinanceInfo } from '../../types';
import {
  Follower,
  RelativeFollower,
  WaitFor,
  Charly,
  Strategy,
  Highest,
} from '../../functions/strategies';
import {
  onlyBnb,
  relatedAgainstUsdt,
  relatedAgainstBnb,
  relatedAgainstUsdtAndBnb,
  filterCharly,
  filterByColdWord,
} from '../../functions/extractors';

const limit = pLimit(5); // DoS Binance creates error

let allNews: BinanceInfo[];

jest.mock('../../services/aws/dynamoDb/queries');

describe.skip('getPerformanceForNews', () => {
  beforeAll(async () => {
    allNews = await getNews();
  });

  it('should perform as expected for highestSync', async () => {
    jest.setTimeout(300000);
    await clearPerformances();
    const newsToTest = _.take(allNews, 200);
    const config = { file: false, database: true };
    const extractors = [
      filterCharly,
      filterByColdWord,
      onlyBnb,
      relatedAgainstUsdt,
      relatedAgainstBnb,
      relatedAgainstUsdtAndBnb,
    ];
    const strategies: Strategy[] = [
      new Highest(),
      new WaitFor(15),
      new Follower(0.001),
      new Follower(0.005),
      new Follower(0.01),
      new Follower(0.02),
      new Follower(0.05),
      new Follower(0.1),
      new RelativeFollower(0.01, 0.05),
      new RelativeFollower(0.05, 0.05),
      new Charly(15, 0.1, 0.05),
      new Charly(15, 0.3, 0.05),
    ];
    await Promise.all(
      strategies.map(async strategy =>
        Promise.all(
          extractors.map(async extractor =>
            Promise.all(
              newsToTest.map(async news =>
                limit(async () =>
                  getPerformanceForNews(news, strategy, extractor, config)
                )
              )
            )
          )
        )
      )
    );
  });
});
