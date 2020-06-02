import json
import numpy as np

def main(event, context):
    a = np.arange(15).reshape(3, 5)
    body = "<h1> HELLO François</h1>"

    response = {
        "statusCode": 200,
        "body": body,
        "headers": { 'Content-Type': 'text/html' }
    }

    return response

if __name__ == "__main__":
    print(main('', ''))
