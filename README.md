# kapochamo-invest

Fully managed serverless AWS autotrading bot that buys crypto on binance when a specific news is out on binance news.
You can find the betting strategy when a news comes out [here](https://github.com/Edweis/kapochamo-invest/blob/master/trading/src/functions/extractors/simplifiedExtractors.ts#L3).

A challenged was open for data analysis that gather some high level architeture insight : [kapochamo-invest-public](https://github.com/Edweis/kapochamo-invest/tree/master/trading/src/docs/public).

I have an EC2 server that pings the lambda `watcher` ten times every seconds. If you only want to to test the code, you can add an cron job every minute on its [lambda function](https://github.com/Edweis/kapochamo-invest/blob/master/trading/serverless.yml#L94).

You can find the transaction report [here](https://api.kapochamo.com/dashboard) and a tool to inspect a currency at a specific time [here](https://api.kapochamo.com/view).
