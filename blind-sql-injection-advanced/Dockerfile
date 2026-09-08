FROM python:3.10-slim-bookworm

ENV APP_USER=dreamhack
ENV APP_PORT=5000
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        python3-dev \
        default-libmysqlclient-dev \
        pkg-config \
        mariadb-common \
        mariadb-server \
        mariadb-client \
    && rm -rf /var/lib/apt/lists/*

RUN useradd --create-home --shell /bin/bash "${APP_USER}"

COPY ./deploy /app
WORKDIR /app

RUN pip install --no-cache-dir -r requirements.txt \
    && chmod +x /app/run.sh

RUN mkdir -p /run/mysqld \
    && chown mysql:mysql /run/mysqld \
    && mariadb-install-db --user=mysql --datadir=/var/lib/mysql \
    && mysqld_safe --skip-networking & \
    MYSQL_PID=$!; \
    sleep 8; \
    mariadb -uroot < /app/init.sql; \
    mariadb-admin -uroot shutdown; \
    wait "${MYSQL_PID}" || true; \
    rm -f /app/init.sql

EXPOSE 5000

CMD ["./run.sh"]