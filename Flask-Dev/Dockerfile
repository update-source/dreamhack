# Use Python 3.8 base image
FROM python:3.8

# Set environment variables
ENV USER=dreamhack
ENV PORT=8000

# Install required system packages
RUN apt-get update -y && \
    apt-get install -y python3-pip build-essential musl-dev gcc

# Set up user and challenge directory
RUN adduser --disabled-password $USER
WORKDIR /app

# Copy application files and set ownership
COPY ./deploy /app
RUN chown -R $USER:$USER /app

# Install Python requirements
RUN pip install --no-cache-dir -r requirements.txt || pip install --no-cache-dir flask

# Compile the flag binary, set execute-only permissions, and clean up source code
# RUN gcc flag.c -o flag && \
#     chmod 111 flag && \
#     rm flag.c

# Switch to the non-root user for security
USER $USER

# Expose the application port
EXPOSE $PORT

# Set the execution command
CMD ["python", "app.py"]
