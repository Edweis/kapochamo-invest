import { binancePrivate, getOrderParams } from '../../services/binance';

const endpoint = '/order/test';
class Order {
  symbol: string;

  quantity: number;

  constructor(symbol: string, quantityBnb: number) {
    this.symbol = symbol;
    this.quantity = quantityBnb;
  }

  private sendOrder = (side: 'BUY' | 'SELL') => {
    console.warn('ABOUT TO DO A TRANSACTION', { side });
    const params = getOrderParams(side, this.symbol, this.quantity);
    return binancePrivate.post(`${endpoint}?${params}`);
  };

  buy = () => this.sendOrder('BUY');

  sell = () => this.sendOrder('SELL');
}

export default Order;
