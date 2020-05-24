import mockAxios from 'jest-mock-axios';
import Order from './order';
import { OrderPostFullResponse } from './types';

const SYMBOL = 'BNBUSDT';
jest.mock('axios', () => mockAxios);
const buyFakeResponse: OrderPostFullResponse = {
  symbol: 'BNBUSDT',
  orderId: 527867339,
  orderListId: -1,
  clientOrderId: 'c9gqKTVszikWy9T4uWEcPi',
  transactTime: 1590316542877,
  price: '0.00000000',
  origQty: 1.0,
  executedQty: '1.00000000',
  cummulativeQuoteQty: '16.72590000',
  status: 'FILLED',
  timeInForce: 'GTC',
  type: 'MARKET',
  side: 'BUY',
  fills: [
    {
      price: '16.72590000',
      qty: '1.00000000',
      commission: '0.00075000',
      commissionAsset: 'BNB',
      tradeId: 60591488,
    },
  ],
};
const sellFakeResponse: OrderPostFullResponse = {
  symbol: 'BNBUSDT',
  orderId: 527869139,
  orderListId: -1,
  clientOrderId: 'bXl0kLTp0pKTnMo6PQ4EDA',
  transactTime: 1590316683747,
  price: '0.00000000',
  origQty: 0.8,
  executedQty: '0.80000000',
  cummulativeQuoteQty: '13.36632000',
  status: 'FILLED',
  timeInForce: 'GTC',
  type: 'MARKET',
  side: 'SELL',
  fills: [
    {
      price: '16.70790000',
      qty: '0.80000000',
      commission: '0.00059981',
      commissionAsset: 'BNB',
      tradeId: 60591552,
    },
  ],
};

describe('Order', () => {
  afterEach(() => mockAxios.reset());

  it('should buy', async () => {
    const QUANTITY = 1;
    const order = new Order(SYMBOL, 1);
    order.buy();
    mockAxios.mockResponse({ data: buyFakeResponse });
    expect(mockAxios.post.mock.calls.length).toEqual(1);
    expect(mockAxios.post.mock.calls[0][0]).toContain(SYMBOL);
    expect(mockAxios.post.mock.calls[0][0]).toContain(QUANTITY.toString());
    expect(mockAxios.post.mock.calls[0][0]).toContain('BUY');

    expect(order.quantityInitial).toEqual(QUANTITY);
    expect(order.quantityFinal).toEqual(null);

    order.sell();
  });

  it('should sell', async () => {
    const QUANTITY = 0.8;
    const order = new Order(SYMBOL, QUANTITY);
    expect(() => order.sell()).toThrow();
    order.buy();
    mockAxios.mockResponse({ data: buyFakeResponse });
    // console.debug(mockAxios.post.mock.calls[0][0]);
    order.sell();
    mockAxios.mockResponse({ data: sellFakeResponse });
    // console.debug(mockAxios.post.mock.calls[1][0]);
    expect(mockAxios.post.mock.calls.length).toEqual(2);
    expect(mockAxios.post.mock.calls[1][0]).toContain(SYMBOL);
    expect(mockAxios.post.mock.calls[1][0]).toContain(QUANTITY.toString());
    expect(mockAxios.post.mock.calls[1][0]).toContain('SELL');

    expect(order.quantityInitial).toEqual(QUANTITY);
    expect(order.quantityFinal).toEqual(QUANTITY);
  });
});
