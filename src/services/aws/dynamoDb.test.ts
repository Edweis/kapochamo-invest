import { formatItem } from './dynamoDb';

describe('formatItem', () => {
  it('should handle empty items', () => {
    expect(formatItem({})).toEqual(null);
  });
  it('should handle simple items', () => {
    const item = { batman: { S: 'hello' } };
    expect(formatItem(item)).toEqual({ batman: 'hello' });
  });
  it('should handle items with several keys', () => {
    const item = { batman: { S: 'hello' }, robin: { S: 'you' } };
    expect(formatItem(item)).toEqual({ batman: 'hello', robin: 'you' });
  });
});
