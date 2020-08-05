# kapochamo-invest

Fully managed serverless AWS autotrading bot that buys crypto on binance when a specific news is out on binance news.
You can find the betting strategy when a news comes out [here](https://github.com/Edweis/kapochamo-invest/blob/master/trading/src/functions/extractors/simplifiedExtractors.ts#L3).

I have an EC2 server that pings the lambda `watcher` ten times every seconds. If you only want to to test the code, you can add an cron job every minute on its [lambda function](https://github.com/Edweis/kapochamo-invest/blob/master/trading/serverless.yml#L94).