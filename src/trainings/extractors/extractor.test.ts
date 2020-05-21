import { BinanceInfo } from '../../types';
import {
  TEST_OPTIMIST_NEWS_TITLE,
  TEST_LISTING_NEWS_TITLE,
} from '../../test-constants';
import {
  allCurrency,
  relatedAgainstUsdt,
  relatedAgainstBnb,
  onlyBnb,
} from './extractor';
import { getOneNews } from '../queries';
import { Extractor } from '../types';

type TestCases = Array<[Extractor, string[]]>;

const optimistTestCases: TestCases = [
  [allCurrency, ['CTSIBNB']],
  [relatedAgainstUsdt, ['BNBUSDT', 'CTSIUSDT']],
  [relatedAgainstBnb, ['CTSIBNB']],
  [onlyBnb, ['BNBUSDT']],
];

const listingTestCases: TestCases = [
  [
    allCurrency,
    ['BNBBTC', 'BNBUSDT', 'BTCUSDT', 'HIVEBNB', 'HIVEBTC', 'HIVEUSDT'],
  ],
  [relatedAgainstUsdt, ['BNBUSDT', 'BTCUSDT', 'HIVEUSDT']],
  [relatedAgainstBnb, ['HIVEBNB']],
  [onlyBnb, ['BNBUSDT']],
];

const tests: Array<[string, string, TestCases]> = [
  ['optimist news', TEST_OPTIMIST_NEWS_TITLE, optimistTestCases],
  ['listing news', TEST_LISTING_NEWS_TITLE, listingTestCases],
];

describe.each(tests)('Extractors for %s', (_testName, title, cases) => {
  let news: BinanceInfo;
  beforeAll(async () => {
    news = await getOneNews(title);
  });
  it.each(cases)('strategy %p', async (extractor, expected) => {
    expect(await extractor(news)).toEqual(expected);
  });
});
