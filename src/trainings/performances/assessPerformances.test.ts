import _ from 'lodash';
import { getNews } from '../queries';
import { clearPerformances } from './export';
import { getPerformanceForNews } from './performance';
import { BinanceInfo } from '../../types';
import {
  Follower,
  RelativeFollower,
  WaitFor,
  Charly,
  StrategyInterface,
  // highestSync,
} from '../../functions/strategies/classes';
import { onlyBnb, relatedAgainstUsdt, relatedAgainstBnb } from '../extractors';

let allNews: BinanceInfo[];

describe.skip('getPerformanceForNews', () => {
  beforeAll(async () => {
    allNews = await getNews();
  });

  it('should perform as expected for highestSync', async () => {
    jest.setTimeout(300000);
    await clearPerformances();
    const newsToTest = _.take(allNews, 200);
    const config = { file: false, database: true };
    const extractors = [onlyBnb, relatedAgainstUsdt, relatedAgainstBnb];
    const strategies: StrategyInterface[] = [
      // highestSync,
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
          extractors.map(extractor =>
            Promise.all(
              newsToTest.map(async news =>
                getPerformanceForNews(news, strategy, extractor, config)
              )
            )
          )
        )
      )
    );
  });
});
// Get stats with :
// SELECT
//   extractor, strategy,
//   (1+avg(performance)/100)^count(performance)-1 as TRI,
//   stddev_samp(performance),
//   count(performance) as nb_trades,
//   count(DISTINCT url) as nb_news,
//   count(symbol) as nb_symols
// FROM performance
// GROUP BY strategy, extractor
// ORDER BY 3 DESC
