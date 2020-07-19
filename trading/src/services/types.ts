export type OrderPostFullResponse = {
  symbol: string;
  orderId: number;
  orderListId: number;
  clientOrderId: string;
  transactTime: number;
  price: string;
  origQty: number;
  executedQty: number;
  cummulativeQuoteQty: number;
  status: string;
  timeInForce: string;
  type: string;
  side: 'SELL' | 'BUY';
  fills: Array<{
    price: string;
    qty: string;
    commission: string;
    commissionAsset: string;
    tradeId: number;
  }>;
};
