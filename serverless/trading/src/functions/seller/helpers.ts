import { Tick, SellerMessage } from '../../types';
import { OrderPostFullResponse } from '../../services/types';
import { POSTPONE_RETRIES } from '../../constants';

export const formatTickFromWs = (wsTick: any): Tick => {
  const tick = JSON.parse(wsTick);
  return {
    open: tick.k.o,
    high: tick.k.h,
    low: tick.k.l,
    close: tick.k.c,
    volume: tick.k.v,
    openTime: tick.k.t,
    closeTime: tick.k.T,
    quoteAssetVolume: tick.k.q,
    numberOfTrades: tick.k.n,
    takerBuyBaseAssetVolume: tick.k.V,
    takerBuyQuoteAssetVolume: tick.k.Q,
    ignore: tick.k.B,
  };
};

export const getVariation = (
  buyResponse: OrderPostFullResponse,
  sellResponse: OrderPostFullResponse
) => {
  const buy = buyResponse.cummulativeQuoteQty;
  const sell = sellResponse.cummulativeQuoteQty;
  return (100 * (sell - buy)) / buy;
};

export const parseMessage = (event: AWSLambda.SQSEvent): SellerMessage => {
  const message = JSON.parse(event.Records[0].body);
  return {
    buyResponse: message.buyResponse,
    postponeTriesLeft: message.postponeTriesLeft ?? POSTPONE_RETRIES,
  } as SellerMessage;
};
