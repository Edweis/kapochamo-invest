import mockAxios from 'jest-mock-axios';
import Order from './order';
import { OrderPostFullResponse } from './types';
import { BINANCE_API_KEY, BINANCE_PRIVATE_KEY } from '../../constants';

jest.mock('axios', () => mockAxios);
const QUANTITY = 50;
const QUANTITY_SPENT = 49.955103;
const QUANTITY_BASE = 3.09;
const QUANTITY_BASE_FINAL = 49.961901;
const SYMBOL = 'BNBUSDT';
const buyFakeResponse: OrderPostFullResponse = {
  symbol: 'BNBUSDT',
  orderId: 528985413,
  orderListId: -1,
  clientOrderId: '3XJB0JUILaIpQMV3gRc8KP',
  transactTime: 1590371338598,
  price: '0.00000000',
  origQty: QUANTITY_BASE,
  executedQty: QUANTITY_BASE,
  cummulativeQuoteQty: QUANTITY_SPENT,
  status: 'FILLED',
  timeInForce: 'GTC',
  type: 'MARKET',
  side: 'BUY',
  fills: [
    {
      price: '16.16670000',
      qty: '3.09000000',
      commission: '0.00231750',
      commissionAsset: 'BNB',
      tradeId: 60650827,
    },
  ],
};
const sellFakeResponse: OrderPostFullResponse = {
  symbol: 'BNBUSDT',
  orderId: 528986310,
  orderListId: -1,
  clientOrderId: '7jKGjNtpL4jFf5mdAG55gh',
  transactTime: 1590371389899,
  price: '0.00000000',
  origQty: QUANTITY_BASE,
  executedQty: QUANTITY_BASE,
  cummulativeQuoteQty: QUANTITY_BASE_FINAL,
  status: 'FILLED',
  timeInForce: 'GTC',
  type: 'MARKET',
  side: 'SELL',
  fills: [
    {
      price: '16.16890000',
      qty: '3.09000000',
      commission: '0.00231843',
      commissionAsset: 'BNB',
      tradeId: 60650842,
    },
  ],
};

describe('Order', () => {
  let order: Order;
  beforeAll(() => {
    order = new Order(SYMBOL, QUANTITY);
  });
  afterEach(() => mockAxios.reset());

  it('should not have a valid binance PK in test', () => {
    expect(BINANCE_API_KEY).toContain('BINANCE');
    expect(BINANCE_PRIVATE_KEY).toContain('BINANCE');
  });

  it('should not sell whithout buy', () => {
    expect(() => order.sell()).toThrow();
  });

  it('should be constructed as expected', () => {
    expect(order.symbol).toEqual(SYMBOL);
    expect(order.quantityQuoteAvailable).toEqual(QUANTITY);
  });

  it('should buy', async () => {
    order.buy();
    mockAxios.mockResponse({ data: buyFakeResponse });
    expect(mockAxios.post.mock.calls.length).toEqual(1);
    expect(mockAxios.post.mock.calls[0][0]).toContain(SYMBOL);
    expect(mockAxios.post.mock.calls[0][0]).toContain(`=${QUANTITY}`); // `=` because the number might be in the hash (unexpected :o)
    expect(mockAxios.post.mock.calls[0][0]).toContain('BUY');

    expect(order.quantityBase).toEqual(QUANTITY_BASE);
    expect(order.quantityQuoteSpent).toEqual(QUANTITY_SPENT);

    order.sell();
  });

  it('should sell', async () => {
    order.sell();
    mockAxios.mockResponse({ data: sellFakeResponse });
    expect(mockAxios.post.mock.calls.length).toEqual(1);
    expect(mockAxios.post.mock.calls[0][0]).toContain(SYMBOL);
    expect(mockAxios.post.mock.calls[0][0]).toContain(
      `quantity=${QUANTITY_BASE}`
    );
    expect(mockAxios.post.mock.calls[0][0]).not.toContain(
      `quantity=${QUANTITY}`
    );
    expect(mockAxios.post.mock.calls[0][0]).toContain('SELL');

    // expect(order.quantityInitial).toEqual(QUANTITY);
    // expect(order.quantityFinal).toEqual(QUANTITY);
  });
});
