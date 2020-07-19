import { formatItemToObject } from './helpers';

describe('formatItemToObject', () => {
  it('should handle empty items', () => {
    expect(formatItemToObject({})).toEqual(null);
  });
  it('should handle simple items', () => {
    const item = { batman: { S: 'hello' } };
    expect(formatItemToObject(item)).toEqual({ batman: 'hello' });
  });
  it('should handle items with several keys', () => {
    const item = { batman: { S: 'hello' }, robin: { S: 'you' } };
    expect(formatItemToObject(item)).toEqual({ batman: 'hello', robin: 'you' });
  });
});
describe('formatObjectToItem', () => {
  it.todo('should work');
});
