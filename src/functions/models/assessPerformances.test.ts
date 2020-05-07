import { getNews } from './queries';
import { clearPerformances } from './export';
import { getPerformanceForNews } from './performance';
import { BinanceInfo } from '../../types';
import { Strategy } from './types';
import { highestStrategy, wait15Minutes, follower, charly } from './strategy';
import { onlyBnb, relatedAgainstUsdt, relatedAgainstBnb } from './extractors';
import _ from 'lodash';
let allNews: BinanceInfo[];

describe('getPerformanceForNews', () => {
  beforeAll(async () => {
    allNews = await getNews();
  });

  it('should performe as expected for highestStrategy', async () => {
    jest.setTimeout(300000);
    await clearPerformances();
    const newsToTest = _.take(allNews, 50000);
    const config = { file: false, database: true };
    const extractors = [onlyBnb, relatedAgainstUsdt, relatedAgainstBnb];
    const strategies: Strategy[] = [
      highestStrategy,
      wait15Minutes,
      follower(0.001),
      follower(0.005),
      follower(0.01),
      follower(0.02),
      follower(0.05),
      follower(0.1),
      charly(0.1, 5),
      charly(0.3, 5),
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
// TODOOOOOO check with `charly` strategy which news to take according to its wording
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
