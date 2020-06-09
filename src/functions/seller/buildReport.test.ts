import { SellerMessage } from '../../types';
import { buildReport } from './buildReport';

const buyResponse: SellerMessage = {
  symbol: 'KAVAUSDT',
  orderId: 34706478,
  orderListId: -1,
  clientOrderId: 'qnxS82e8dMIGg9cnQEQSaL',
  transactTime: 1591623608820,
  price: '0.00000000',
  origQty: Number('26.08000000'),
  executedQty: Number('26.08000000'),
  cummulativeQuoteQty: Number('29.98939200'),
  status: 'FILLED',
  timeInForce: 'GTC',
  type: 'MARKET',
  side: 'BUY',
  fills: [
    {
      price: '1.14990000',
      qty: '26.08000000',
      commission: '0.00123967',
      commissionAsset: 'BNB',
      tradeId: 1534344,
    },
  ],
};
const sellReponse: SellerMessage = {
  symbol: 'KAVAUSDT',
  orderId: 34712618,
  orderListId: -1,
  clientOrderId: '4VNifL9ecky0ptwMntjOSX',
  transactTime: 1591624122085,
  price: '0.00000000',
  origQty: Number('26.08000000'),
  executedQty: Number('26.08000000'),
  cummulativeQuoteQty: Number('30.34962400'),
  status: 'FILLED',
  timeInForce: 'GTC',
  type: 'MARKET',
  side: 'SELL',
  fills: [
    {
      price: '1.16390000',
      qty: '11.71000000',
      commission: '0.00058819',
      commissionAsset: 'BNB',
      tradeId: 1535413,
    },
    {
      price: '1.16360000',
      qty: '8.60000000',
      commission: '0.00043186',
      commissionAsset: 'BNB',
      tradeId: 1535414,
    },
    {
      price: '1.16350000',
      qty: '5.77000000',
      commission: '0.00028972',
      commissionAsset: 'BNB',
      tradeId: 1535415,
    },
  ],
};

jest.mock('../../services/aws/dynamoDb/queries');
describe('buildReport', () => {
  it('should not crash', async () => {
    const report = await buildReport(buyResponse, sellReponse);
    console.log(report);
    expect(report).toBeTruthy();
  });
});
