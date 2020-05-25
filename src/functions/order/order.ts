import { binancePrivate, getOrderParams } from '../../services/binance';
import { OrderPostFullResponse } from './types';
import { isTest } from '../../constants';

const endpoint = isTest ? '/order/test' : 'order';
class Order {
  symbol: string;

  quantityBase: number | null = null;

  quantityQuoteFinal: number | null = null;

  quantityQuoteAvailable: number;

  quantityQuoteSpent: number | null = null;

  constructor(symbol: string, quantityQuote: number) {
    this.symbol = symbol;
    this.quantityQuoteAvailable = quantityQuote;
  }

  private sendOrder = (side: 'BUY' | 'SELL') => {
    let quantity = this.quantityQuoteAvailable;
    if (side === 'SELL') {
      if (this.quantityBase == null)
        throw new Error('You must buy before selling');
      quantity = this.quantityBase;
    }
    const params = getOrderParams(side, this.symbol, quantity);
    console.warn('TX : ', { side }, params);
    return binancePrivate
      .post<OrderPostFullResponse>(`${endpoint}?${params}`)
      .then(response => {
        // console.warn('TX DONE', response.data);
        if (side === 'BUY') {
          this.quantityBase = response.data.origQty;
          this.quantityQuoteSpent = response.data.cummulativeQuoteQty;
        }
        if (side === 'SELL') this.quantityQuoteFinal = response.data.origQty;
      })
      .catch(error => {
        console.error(
          'Error at /order',
          error.response.data,
          error.request.url
        );
        throw error;
      });
  };

  buy = () => {
    return this.sendOrder('BUY');
  };

  sell = () => {
    return this.sendOrder('SELL');
  };
}

export default Order;
