import { getWords, getAssetFromInfo } from './formating';
import { getAllAssets } from './helpers';
import { TEST_OPTIMIST_NEWS, TEST_LISTING_NEWS } from '../../test-constants';

jest.mock('../../services/aws/dynamoDb/queries');
describe('getWords', () => {
  it('should take the rights words', () => {
    expect(getWords('')).toEqual([]);
    expect(getWords('hello')).toEqual(['hello']);
    expect(getWords('(123)')).toEqual(['123']);
    expect(getWords('HELLO you')).toEqual(['hello', 'you']);
    expect(getWords('  bat/man ')).toEqual(['bat', 'man']);
  });

  it('should take upper words', () => {
    expect(getWords('hello', true)).toEqual([]);
    expect(getWords('HELLO', true)).toEqual(['HELLO']);
    expect(getWords('(123)', true)).toEqual([]);
    expect(getWords('HELLO you', true)).toEqual(['HELLO']);
  });
});

describe('getAssetFromInfo', () => {
  let assets: string[] = [];
  beforeAll(async () => {
    assets = await getAllAssets();
    // console.debug(assets);
  });
  it('should work on info', async () => {
    expect(await getAssetFromInfo(TEST_OPTIMIST_NEWS, assets)).toEqual([
      'BNB',
      'CTSI',
    ]);
    expect(await getAssetFromInfo(TEST_LISTING_NEWS, assets)).toEqual([
      'BNB',
      'BTC',
      'HIVE',
      'USDT',
    ]);
  });
});
