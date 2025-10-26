# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first (for caching)
COPY package*.json ./

# Install pnpm 
RUN npm install -g pnpm

# Install all dependencies (include dev for nodemon)
RUN pnpm install

# Copy the rest of the app
COPY . .

# Default command
CMD ["pnpm", "run", "dev-docker"]

