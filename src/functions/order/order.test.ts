import mockAxios from 'jest-mock-axios';
import Order from './order';

jest.mock('axios', () => mockAxios);
describe('Order', () => {
  afterEach(() => mockAxios.reset());

  it('should buy', async () => {
    const order = new Order('SYM', 0.7);
    order.buy();
    expect(mockAxios.post.mock.calls.length).toEqual(1);
    expect(mockAxios.post.mock.calls[0][0]).toContain('SYM');
    expect(mockAxios.post.mock.calls[0][0]).toContain('0.7');
    expect(mockAxios.post.mock.calls[0][0]).toContain('BUY');
  });

  it('should sell', async () => {
    const order = new Order('SYB', 0.8);
    order.sell();
    expect(mockAxios.post.mock.calls.length).toEqual(1);
    expect(mockAxios.post.mock.calls[0][0]).toContain('SYB');
    expect(mockAxios.post.mock.calls[0][0]).toContain('0.8');
    expect(mockAxios.post.mock.calls[0][0]).toContain('SELL');
  });
});
