# Debug cproxy và watchdog bằng VS Code

## Vị trí tệp

Chép các tệp vào đúng vị trí dưới đây, tính từ thư mục chứa
`docker-compose.yml`:

```text
.vscode/launch.json
.vscode/tasks.json
docker-compose.debug.yml
deploy/watchdog/Dockerfile.debug
```

Không cần sửa Dockerfile production hiện có.

## Extension cần cài

- JavaScript Debugger tích hợp sẵn trong VS Code.
- Python extension của Microsoft (cung cấp `debugpy`).
- Docker extension là tùy chọn.

## Chạy debug

1. Mở đúng thư mục gốc dự án bằng VS Code.
2. Đặt breakpoint trong mã nguồn:
   - Node: `deploy/cproxy/cproxy/...`
   - Python: `deploy/watchdog/check.py`
3. Mở **Run and Debug** (`Ctrl+Shift+D`).
4. Chọn **Docker: Debug full stack** rồi nhấn `F5`.

Profile compound sẽ build stack bằng cả `docker-compose.yml` và
`docker-compose.debug.yml`, sau đó attach Node ở cổng `9229` và Python ở cổng
`5678`.

Watchdog dùng `--wait-for-client`, vì vậy `check.py` chưa chạy cho tới khi VS
Code attach. Sau khi script kết thúc, container chờ 7 giây rồi mở lại phiên
debug cho lượt tiếp theo.

## Dừng stack

Chạy task **docker-compose: debug down** từ **Terminal > Run Task**.

Hoặc chạy:

```bash
docker compose -f docker-compose.yml -f docker-compose.debug.yml down
```

## Nếu breakpoint Node không khớp

Cấu hình giả định mã Node trên máy nằm ở `deploy/cproxy/cproxy` vì Dockerfile có
lệnh `COPY cproxy /cproxy`. Nếu cấu trúc thật khác, chỉ sửa `localRoot` trong
`.vscode/launch.json`; giữ `remoteRoot` là `/cproxy`.
