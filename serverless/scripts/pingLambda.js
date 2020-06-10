// mkdir -p ~/src;
// cd ~/src;
// npm install aws-sdk;
// source ~/.env;
// curl \
//  -H 'Authorization: token $GIT_TOKEN_OAUTH'   \
//  -H 'Accept: application/vnd.github.v3.raw' \
//  -L 'https://raw.githubusercontent.com/Edweis/kapochamo-invest/master/serverless/scripts/pingLambda.js' \
// | node
const AWS = require('aws-sdk');

const LAMBDA_NAME = 'kapochamo-invest-dev-WatcherBinance';
const STEP_MS = 500;
console.debug('#########################');
console.debug('### Hello François :) ###');
console.debug('#########################');
console.debug('');
console.debug('I will invoke ', LAMBDA_NAME);
console.debug('every '+STEP_MS+'ms');
console.debug();

const lambda = new AWS.Lambda();
const params = { FunctionName: LAMBDA_NAME, InvokeArgs: '{}' };

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const run = () =>
  sleep(STEP_MS).then(async () => {
    await lambda.invokeAsync(params).promise();
    console.debug('Called', new Date().toISOString());
    await run();
  });

run();
