import HttpStatus from 'http-status-codes';
import nunjucks from 'nunjucks';
// import { binancePublic } from '../../services/binance';
import template from './template.html';
import { getTransactions } from '../../services/aws/dynamoDb';

nunjucks.configure({ autoescape: false });
console.debug(template.length);

const handler = async (event: AWSLambda.APIGatewayEvent) => {
  // const queryString = event.queryStringParameters;
  const response = await getTransactions();
  console.debug(event, response);
  const page = nunjucks.renderString(template, {});
  return {
    statusCode: HttpStatus.OK,
    headers: { 'Content-Type': 'text/html' },
    body: page,
  };
};

export default handler;
