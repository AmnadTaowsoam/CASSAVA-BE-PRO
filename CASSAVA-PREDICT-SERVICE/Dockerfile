# Stage 1: Build Stage
FROM python:3.10-slim as builder

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential

# Set the working directory in the container
WORKDIR /app

# Copy only the requirements file and environment file to avoid cache invalidation
COPY requirements.txt ./

# Install the required Python packages in a virtual environment
# This reduces the image size and ensures that the dependencies 
# are isolated from the global Python environment
RUN python -m venv /venv && \
    /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install --no-cache-dir -r requirements.txt && \
    apt-get purge -y --auto-remove build-essential && \
    rm -rf /var/lib/apt/lists/*

# Stage 2: Final Image
FROM python:3.10-slim

# Set environment variables to ensure Python runs in unbuffered mode
# This is recommended when running Python within Docker containers
# It ensures that the logs are output immediately and not buffered
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/venv/bin:$PATH"

# Copy the virtual environment from the builder stage
COPY --from=builder /venv /venv

# Set the working directory in the container
WORKDIR /app

# Copy the project files into the container
COPY . .

# Expose the port on which the FastAPI app will run
EXPOSE 8002

# Use an unprivileged user to run the app (security best practice)
# Avoid running the application as root unless necessary
RUN useradd -m myuser
USER myuser

# Command to run the FastAPI app using the installed virtual environment
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]
