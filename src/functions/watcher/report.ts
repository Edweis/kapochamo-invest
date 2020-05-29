import { sendEmail } from '../../services/aws/sns';
import { BinanceInfo } from '../../types';

export const watcherReportTemplate = async (
  info: BinanceInfo,
  symbols: string[]
) => {
  let message = 'A news was published : \n\n';
  message += `${info.title}\n`;
  message += `${info.url}\n\n`;
  message += `Published at :\t${info.time.toISOString()}\n`;
  message += `Action at : \t${new Date().toISOString()}\n`;
  message += `Traded on ${symbols.join(', ')}`;
  await sendEmail(message);
};
