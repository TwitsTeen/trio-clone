# Dockerfile for Bun API Server

# Use the official Bun image as the base
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy the server code into the container
COPY ./backend/package.json ./backend/bun.lock ./

# Install dependencies
RUN bun install

# Copy the rest of the server files
COPY ./backend/ .

# Expose the port that the server will run on
EXPOSE 3000

# Start the Bun server
CMD ["bun", "run", "dev"]
