import { getChartFromSymbol, watcherReportTemplate } from './report';
import { TEST_OPTIMIST_NEWS } from '../../test-constants';
import Profiling from './profiling';

jest.mock('../../services/aws/dynamoDb/queries');
describe('getChartFromSymbol', () => {
  it('should get BNB_BTC', async () => {
    const url = await getChartFromSymbol('BNBBTC');
    expect(url).toEqual('https://www.binance.com/en/trade/BNB_BTC');
  });
});

describe('watcherReportTemplate', () => {
  const profiling = new Profiling();
  profiling.start = [627427, 951993643];
  profiling.report = [
    { name: 'Setup', hrtime: [627427, 962502547] },
    { name: 'Api call', hrtime: [627428, 345148748] },
    { name: 'Here is the url', hrtime: [627428, 345898357] },
    { name: 'Fetch news', hrtime: [627428, 345916335] },
    { name: 'Update News', hrtime: [627428, 345918485] },
    { name: 'Extractor', hrtime: [627428, 346401848] },
    { name: 'send template', hrtime: [627429, 776939845] },
  ];
  it('should render', async () => {
    const report = await watcherReportTemplate(
      TEST_OPTIMIST_NEWS.url,
      TEST_OPTIMIST_NEWS.title,
      ['CTSIUSDT', 'BNBUSDT'],
      profiling
    );
    console.log(report);
    expect(report).toBeTruthy();
  });
});
