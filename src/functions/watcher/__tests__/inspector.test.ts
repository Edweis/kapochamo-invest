import axios from 'axios';
import { binanceInspector } from '../inspector';
import { MOCK_API_RESPONSES } from './apiResponses';

jest.mock('axios');
const mockedAxios = (axios as unknown) as jest.Mocked<typeof axios>;

// eslint-disable-next-line
// @ts-ignore
mockedAxios.get.mockImplementation((url: string) => ({
  // eslint-disable-next-line
  // @ts-ignore
  data: MOCK_API_RESPONSES[url],
}));

const LATEST_NEWS = 'Binance Savings Adds ATOM and NEO to Flexible Savings';
describe('binanceInspector', () => {
  it('should return true if news is new', async () => {
    expect(await binanceInspector('Some news News !')).not.toEqual(null);
  });
  it('should return false if news is new', async () => {
    expect(await binanceInspector(LATEST_NEWS)).toEqual(null);
  });
});
