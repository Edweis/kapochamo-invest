import { getNews } from './queries';
import { clearPerformances } from './export';
import { getPerformanceForNews } from './performance';
import { BinanceInfo } from '../../types';
import { Strategy } from './types';
import { highestStrategy, wait15Minutes, follower } from './strategy';
import { allCurrency } from './extractors';
import _ from 'lodash';
let allNews: BinanceInfo[];

describe('getPerformanceForNews', () => {
  beforeAll(async () => {
    allNews = await getNews();
    await clearPerformances();
  });

  it('should performe as expected for highestStrategy', async () => {
    const newsToTest = _.take(allNews, 50);
    const config = { file: false, database: true };
    const strategies: Strategy[] = [
      highestStrategy,
      wait15Minutes,
      follower(0.001),
      follower(0.005),
      follower(0.01),
      follower(0.02),
      follower(0.05),
      follower(0.1),
    ];
    await Promise.all(
      strategies.map(async strategy =>
        Promise.all(
          newsToTest.map(async news =>
            getPerformanceForNews(news, strategy, allCurrency, config)
          )
        )
      )
    );
  });
});
