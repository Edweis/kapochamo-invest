import axios from 'axios';
import { binanceInspector } from '../inspector';
import {
  MOCK_REAL_API_RESPONSES,
  MOCK_FAKE_API_RESPONSES,
} from './apiResponses';

jest.mock('axios');
jest.mock('../../../services/aws/dynamoDb/queries');
const mockedAxios = (axios as unknown) as jest.Mocked<typeof axios>;

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
