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

  logger: (message: { [key: string]: any }) => void = console.warn;

  constructor(symbol: string, quantityQuote: number) {
    this.symbol = symbol;
    this.quantityQuoteAvailable = quantityQuote;
  }

  private sendOrder = (side: 'BUY' | 'SELL', quantity: number) => {
    const params = getOrderParams(side, this.symbol, quantity);
    console.log('TX : ', { side }, params);
    return binancePrivate
      .post<OrderPostFullResponse>(`${endpoint}?${params}`)
      .catch(error => {
        let message = `Api error at ${error.request.url}\n`;
        message += `${error.message} : ${error.response.data}`;
        throw { ...error, message };
      });
  };

  buy = () => {
    const quantity = this.quantityQuoteAvailable;
    return this.sendOrder('BUY', quantity).then(response => {
      this.quantityBase = response.data.origQty;
      this.quantityQuoteSpent = response.data.cummulativeQuoteQty;
      this.logger({
        message: 'BUY TX DONE',
        url: response.request.url,
        data: response.data,
      });
    });
  };

  sell = () => {
    if (this.quantityBase == null)
      throw new Error('You must buy before selling');
    const quantity = this.quantityBase;
    return this.sendOrder('SELL', quantity).then(response => {
      this.quantityQuoteFinal = response.data.cummulativeQuoteQty;
      this.logger({
        message: 'SELL TX DONE',
        url: response.request.url,
        variation: this.getVariation(),
        data: response.data,
      });
    });
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
