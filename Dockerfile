# Stage 1: Build and install dependencies
FROM python:3.12-slim AS build

# Set the working directory for all subsequent commands.
WORKDIR /app

# Copy the core project files.
COPY pyproject.toml uv.lock ./

# Install system dependencies.
# build-essential is often needed to compile certain Python packages.
RUN apt-get update && apt-get install -y curl build-essential && rm -rf /var/lib/apt/lists/*

# Install uv using the official script.
# The binary will be installed to /root/.cargo/bin by default.
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

# Set the PATH to include the default uv install location.
ENV PATH="/root/.local/bin:${PATH}"

# Initialize the virtual environment and install dependencies.
# uv init creates the .venv directory, and uv sync installs packages based on uv.lock.
RUN uv sync

# Copy the rest of the project files.
COPY . .

# Stage 2: Final (runtime) image
FROM python:3.12-slim AS final

# Set the working directory
WORKDIR /app

# Copy the uv executable from the build stage to the final image.
# We choose a directory already in the default PATH for simplicity.
COPY --from=build /root/.local/bin/uv /usr/local/bin/uv

# Copy the entire application, including the virtual environment.
COPY --from=build /app .

# Set the PATH to include the uv-created virtual environment's executables.
ENV PATH="/app/.venv/bin:${PATH}"

# Expose the port your application listens on.
EXPOSE 5000

# This is the command that will run when the container starts.
CMD ["uv", "run", "main.py"]
