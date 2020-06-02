import json
import numpy as np
from jinja2 import Template

def main(event, context):
    a = np.arange(15).reshape(3, 5)
    template = Template(open('template.html').read())
    body = template.render(name='François')

    response = {
        "statusCode": 200,
        "body": body,
        "headers": { 'Content-Type': 'text/html' }
    }

    return response

if __name__ == "__main__":
    print(main('', ''))
