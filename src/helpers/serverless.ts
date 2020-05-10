import HttpStatus from 'http-status-codes';

type JSON = { [key: string]: any };

type ResponseOptions = { json: JSON; statusCode: number; allowCORS?: boolean };

type Response = {
  statusCode: number;
  body: string;
  headers?: { [key: string]: any };
};

const lambdaResponse = ({
  json,
  statusCode,
  allowCORS = false,
}: ResponseOptions) => {
  const response: Response = { statusCode, body: JSON.stringify(json) };
  if (allowCORS) response.headers = { 'Access-Control-Allow-Origin': '*' };
  return response;
};

export const errorResponse = (
  json: JSON,
  statusCode: number = HttpStatus.BAD_REQUEST
) => {
  console.error('Failed lambda', {
    json,
    statusCode,
  });
  throw lambdaResponse({ json, statusCode });
};

export const successResponse = (
  json: JSON,
  statusCode: number = HttpStatus.OK
) => lambdaResponse({ json, statusCode });

export const runWarm = (lambdaFunc: Function): AWSLambda.Handler => async (
  event,
  context
) => {
  // Detect the keep-alive ping from CloudWatch and exit early. This keeps our
  // lambda function running hot.
  if (event.source === 'serverless-plugin-warmup') {
    return 'pinged';
  }

  return lambdaFunc(event, context);
};
