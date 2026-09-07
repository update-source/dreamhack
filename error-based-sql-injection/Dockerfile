FROM python:3.10-slim-bookworm

ENV user=dreamhack
ENV port=5000

# Install dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        python3-dev \
        default-libmysqlclient-dev \
        pkg-config \
        mariadb-common \
        mariadb-server \
        mariadb-client && \
    rm -rf /var/lib/apt/lists/*

# Create application user
RUN adduser --disabled-password --gecos "" "$user"

# Copy application
COPY ./deploy /app
WORKDIR /app

RUN pip install --no-cache-dir -r requirements.txt
RUN chmod +x run.sh

# Initialize database
RUN mkdir -p /run/mysqld && \
    chown mysql:mysql /run/mysqld && \
    /usr/bin/mysqld_safe & \
    sleep 10 && \
    mysql -uroot < /app/init.sql && \
    mysqladmin -uroot shutdown && \
    rm /app/init.sql

EXPOSE 5000

CMD ["./run.sh"]