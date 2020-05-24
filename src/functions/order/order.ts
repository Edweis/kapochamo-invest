import { binancePrivate, getOrderParams } from '../../services/binance';
import { OrderPostFullResponse } from './types';
import { isRunLocally, isTest } from '../../constants';

const endpoint = isRunLocally || isTest ? '/order/test' : 'order';
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
        if (side === 'BUY')
          this.quantityAssetBought = Number(response.data.origQty);
        if (side === 'SELL') this.quantityFinal = Number(response.data.origQty);
      });
  };

  buy = () => {
    return this.sendOrder('BUY');
  };

  sell = () => {
    if (this.quantityAssetBought)
      throw new Error('You must buy before selling');
    return this.sendOrder('SELL');
  };
}

export default Order;
