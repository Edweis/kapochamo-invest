import { getAllAssets, getCombinedSymbols } from './helpers';

jest.mock('../../services/aws/dynamoDb/queries');
describe('getAllAssets', () => {
  it('should get all assets', async () => {
    const assets = await getAllAssets();
    expect(assets.length).toBeGreaterThan(150);
  });
});

describe('getCombinedSymbols', () => {
  it('should get BTC assets', async () => {
    const assets = await getCombinedSymbols(['BTC', 'BNB'], ['USDT']);
    expect(assets).toEqual(['BNBUSDT', 'BTCUSDT']);
  });
});
