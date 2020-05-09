import _ from 'lodash';
import { getNews } from '../queries';
import { clearPerformances } from '../export';
import { getPerformanceForNews } from './performance';
import { BinanceInfo } from '../../../types';
import { Strategy } from '../types';
import {
  followerLst,
  relativeFollower,
  waitLst,
  charly,
  convertSync,
  highestSync,
} from '../strategies/listeners';
import { onlyBnb, relatedAgainstUsdt, relatedAgainstBnb } from '../extractors';

let allNews: BinanceInfo[];

describe.skip('getPerformanceForNews', () => {
  beforeAll(async () => {
    allNews = await getNews();
  });

  it('should perform as expected for highestSync', async () => {
    jest.setTimeout(300000);
    await clearPerformances();
    const newsToTest = _.take(allNews, 50000);
    const config = { file: false, database: true };
    const extractors = [onlyBnb, relatedAgainstUsdt, relatedAgainstBnb];
    const strategies: Strategy[] = [
      highestSync,
      convertSync(waitLst, [15]),
      convertSync(followerLst, [0.001]),
      convertSync(followerLst, [0.005]),
      convertSync(followerLst, [0.01]),
      convertSync(followerLst, [0.02]),
      convertSync(followerLst, [0.05]),
      convertSync(followerLst, [0.1]),
      convertSync(relativeFollower, [0.01, 0.05]),
      convertSync(relativeFollower, [0.05, 0.05]),
      convertSync(charly, [15, 0.1, 0.05]),
      convertSync(charly, [15, 0.3, 0.05]),
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
