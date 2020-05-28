import HttpStatus from 'http-status-codes';
import populateSymbols from './populateSymbols';
import { getSymbols } from '../services/aws/dynamoDb';

jest.mock('../services/aws/dynamoDb/queries');
describe('populateSymbols', () => {
  it('should reset symbol db', async () => {
    const response = await populateSymbols();
    expect(response.statusCode).toEqual(HttpStatus.OK);
    const allKeys = await getSymbols();
    expect(allKeys.length).toBeGreaterThan(500);
  });
});
