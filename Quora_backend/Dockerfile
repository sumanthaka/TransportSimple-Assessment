# Pull base image
FROM python:3.10.12-slim-buster

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y netcat-traditional \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /usr/src/backend

# Install Python dependencies
COPY ./requirements.txt .
RUN pip install --upgrade pip \
    && pip install -r requirements.txt \
    && rm -rf /root/.cache/pip

# Copy entrypoint
COPY ./app/entrypoint.sh /usr/src/backend/entrypoint.sh
RUN sed -i 's/\r$//g' /usr/src/backend/entrypoint.sh \
    && chmod +x /usr/src/backend/entrypoint.sh

# Copy project
COPY . .

# Run entrypoint.sh
ENTRYPOINT ["/usr/src/backend/entrypoint.sh"]