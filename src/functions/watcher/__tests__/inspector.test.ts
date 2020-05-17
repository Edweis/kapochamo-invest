import axios from 'axios';
import { binanceInspector } from '../inspector';
import {
  MOCK_REAL_API_RESPONSES,
  MOCK_FAKE_API_RESPONSES,
} from './apiResponses';
import { getExistingUrl } from '../../../services/aws/dynamoDb';

jest.mock('axios');
jest.mock('../../../services/aws/dynamoDb');
const mockedAxios = (axios as unknown) as jest.Mocked<typeof axios>;
const mockeGetExistingUrl = (getExistingUrl as unknown) as jest.MockedFunction<
  typeof getExistingUrl
>;
const LATEST_NEWS =
  'https://binance.zendesk.com/hc/en-us/articles/360042918512';
mockeGetExistingUrl.mockImplementation(async title =>
  title === LATEST_NEWS ? { url: title } : null
);

describe('binanceInspector', () => {
  it('should return null if news is not new', async () => {
    mockedAxios.get.mockImplementationOnce(async () => ({
      data: MOCK_REAL_API_RESPONSES,
    }));
    expect(await binanceInspector()).toEqual(null);
  });
  it('should return the link if news is new', async () => {
    // We pretend the news is not new
    mockedAxios.get.mockImplementationOnce(async () => ({
      data: MOCK_FAKE_API_RESPONSES,
    }));
    expect(await binanceInspector()).not.toEqual(null);
  });
});
