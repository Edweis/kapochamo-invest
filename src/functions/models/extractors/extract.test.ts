import { getWords } from './extract';

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
