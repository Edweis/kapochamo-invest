import { binancePrivate, getOrderParams } from '../../services/binance';
import { OrderPostFullResponse } from './types';
import { isTest } from '../../constants';

const endpoint = isTest ? '/order/test' : 'order';
class Order {
  symbol: string;

  quantityAssetBought: number | null = null;

  quantityInitial: number;

  quantityFinal: number | null = null;

  constructor(symbol: string, quantityBnb: number) {
    this.symbol = symbol;
    this.quantityInitial = quantityBnb;
  }

  private sendOrder = (side: 'BUY' | 'SELL') => {
    const params = getOrderParams(side, this.symbol, this.quantityInitial);
    console.warn('TX : ', { side }, params);
    return binancePrivate
      .post<OrderPostFullResponse>(`${endpoint}?${params}`)
      .then(response => {
        console.warn('TX DONE', response.data);
        if (side === 'BUY') this.quantityAssetBought = response.data.origQty;
        if (side === 'SELL') this.quantityFinal = response.data.origQty;
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
    if (this.quantityAssetBought == null) {
      throw new Error('You must buy before selling');
    }
    return this.sendOrder('SELL');
  };
}

export default Order;
