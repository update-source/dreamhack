pumpkin = [ 124, 112, 59, 73, 167, 100, 105, 75, 59, 23, 16, 181, 165, 104, 43, 49, 118, 71, 112, 169, 43, 53 ]
pie = 1

for _ in range(100):
    for i in range(len(pumpkin)):
        pumpkin[i] ^= pie
        pie = ((pie ^ 0xff) + (i * 10)) & 0xff

# Reconstruct the decrypted flag string
flag = "".join(chr(x) for x in pumpkin)
print(flag)
