# Use the latest stable, non-deprecated Debian-based Python slim image
FROM python:3.12-slim-bookworm

# Set environment variables
ENV USER=hack
ENV PORT=5000

# Install modern system dependencies and MariaDB server/client
# Combined to reduce layer size and cleaned up to prevent image bloat
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    build-essential \
    default-libmysqlclient-dev \
    pkg-config \
    mariadb-server \
    mariadb-client \
    && rm -rf /var/lib/apt/lists/*

# Setup application directory and create a secure non-root user
WORKDIR /app
RUN adduser --disabled-password --gecos "" $USER

# Upgrade pip and install Python requirements
COPY ./deploy/requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application files and fix permissions
COPY ./deploy /app
RUN chmod +x run.sh && \
    chown -R $USER:$USER /app

# Initialize the MariaDB database correctly during the build phase
# We ensure the service directory exists, start the engine, load the schema, and shut down cleanly
RUN mkdir -p /var/run/mysqld && chown -R mysql:mysql /var/run/mysqld && \
    mariadb-install-db --user=mysql --datadir=/var/lib/mysql && \
    mysqld_safe --datadir=/var/lib/mysql & \
    sleep 3 && \
    mysql -u root < /app/init.sql && \
    mysqladmin -u root shutdown && \
    rm /app/init.sql

# Expose the application port
EXPOSE $PORT

# Switch to the non-root user for security (uncomment if your run.sh script doesn't require root)
# USER $USER

# Use a wrapper command to start MariaDB AND your application script at runtime
CMD ["sh", "-c", "mysqld_safe --datadir=/var/lib/mysql & sleep 3 && ./run.sh"]
