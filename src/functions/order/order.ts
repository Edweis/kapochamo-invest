import { binancePrivate, getOrderParams } from '../../services/binance';
import { OrderPostFullResponse } from './types';
import { isTest, isRunLocally } from '../../constants';

const endpoint = isTest || isRunLocally ? '/order/test' : 'order';
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
    // UGLY REFACTOR ME
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
        console.warn('TX DONE', response.data);
        if (side === 'BUY') {
          this.quantityBase = response.data.origQty;
          this.quantityQuoteSpent = response.data.cummulativeQuoteQty;
        }
        if (side === 'SELL')
          this.quantityQuoteFinal = response.data.cummulativeQuoteQty;
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

  getVariation = (priceBase?: number) => {
    if (this.quantityBase == null) return null;
    const quoteQuantity =
      priceBase == null
        ? this.quantityQuoteFinal
        : priceBase * this.quantityBase;
    if (quoteQuantity == null) return null;
    if (this.quantityQuoteSpent == null) return null;
    const variation =
      (100 * (quoteQuantity - this.quantityQuoteSpent)) /
      this.quantityQuoteSpent;
    if (Math.abs(variation) < 1e-10) return 0;
    return variation;
  };
}

export default Order;
