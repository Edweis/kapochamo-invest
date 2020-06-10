import Follower from './follower';
import waitToSell from './waitToSell';
import { sendEmail } from '../../services/aws/sns';
import { sendOrder } from '../../services/binance';
import { SellerMessage } from '../../types';
import { buildReport } from './buildReport';

const seller: Function = async (event: AWSLambda.SQSEvent) => {
  try {
    const buyResponse = JSON.parse(event.Records[0].body) as SellerMessage;
    const { symbol } = buyResponse;
    const buyBaseQuantity = buyResponse.origQty;

    const strategy = new Follower(0.02);
    await waitToSell(strategy, symbol);
    const sellRequest = await sendOrder('SELL', symbol, buyBaseQuantity);

    const report = await buildReport(buyResponse, sellRequest.data);
    await sendEmail(report);
    return;
  } catch (error) {
    await sendEmail(JSON.stringify(error, null, '\t'));
    throw error;
  }
};

export default seller;
