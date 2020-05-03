import { getOneNews } from './queries';
import { getTicksAroundNews } from './populateTicks';

describe('getTicksAroundNews', () => {
  it('should write ticks in file', async () => {
    const news = await getOneNews(
      'The Binance Futures Tournament Has Now Concluded'
    );
    await getTicksAroundNews(news);
  });
});
