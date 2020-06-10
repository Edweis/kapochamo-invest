import json
from jinja2 import Template
from datetime import datetime
import requests

base_url = 'https://api.binance.com/api/v3'
parameters = {
    'interval': '1m'
}
columns = [
    'open_time',
    'open',
    'high',
    'low',
    'close',
    'volume',
    'close_time',
    'quote_asset_volume',
    'number_of_trades',
    'taker_buy_base_asset_volume',
    'taker_buy_quote_asset_volume',
    'ignore',
]


def main(event, context):
    print(event)
    time = 1587271070010
    symbol = 'BTCUSDT'
    limit = 90
    if type(event) != 'str':
        if 'queryStringParameters' in event:
            qs  = event['queryStringParameters']
            print(qs)
            if qs is not None:
                if 'time' in qs:
                    time = qs['time']
                if 'symbol' in qs:
                    symbol = qs['symbol']
                if 'limit' in qs:
                    limit = qs['limit']

    parameters['startTime'] = time
    parameters['symbol'] = symbol
    parameters['limit'] = limit

    # Get ticks
    tick_response = requests.get(base_url+'/klines', parameters)
    ticks = tick_response.json()
    if tick_response.status_code != 200:
        return {
            "statusCode": 400,
            "body": json.dumps({
                "error": ticks,
                "time": time,
                "symbol": symbol,
                "limit": limit
            }),
            "headers": { 'Content-Type': 'application/json' }
        }
    formated_ticks = [
        {"x": tick[0], "y": [float(v) for v in tick[1:5] ]} for tick in ticks
    ]

    # fill template
    template = Template(open('template.html').read())
    body = template.render(
        data=formated_ticks,
        time=time,
        symbol=symbol,
        limit=limit
    )


    return {
        "statusCode": 200,
        "body": body,
        "headers": { 'Content-Type': 'text/html' }
    }


if __name__ == "__main__":
    print(main('', '')['body'])