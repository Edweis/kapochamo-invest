import { BinanceInfo } from '../../types';
import { TEST_OPTIMIST_NEWS, TEST_LISTING_NEWS } from '../../test-constants';
import {
  allCurrency,
  relatedAgainstUsdt,
  relatedAgainstBnb,
  onlyBnb,
} from './extractor';
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

const tests: Array<[string, BinanceInfo, TestCases]> = [
  ['optimist news', TEST_OPTIMIST_NEWS, optimistTestCases],
  ['listing news', TEST_LISTING_NEWS, listingTestCases],
];

jest.mock('../../services/aws/dynamoDb/queries');
describe.each(tests)('Extractors for %s', (_testName, news, cases) => {
  it.each(cases)('strategy %p', async (extractor, expected) => {
    const symbols = await extractor(news);
    expect(symbols.sort()).toEqual(expected.sort());
  });
});
