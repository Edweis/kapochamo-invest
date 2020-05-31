import { getChartFromSymbol } from './report';

jest.mock('../../services/aws/dynamoDb/queries');
describe('getChartFromSymbol', () => {
  it('should get BNB_BTC', async () => {
    const url = await getChartFromSymbol('BNBBTC');
    expect(url).toEqual('https://www.binance.com/en/trade/BNB_BTC');
  });
});
