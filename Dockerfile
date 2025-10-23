# Use official Node.js 24.9 on Alpine 3.22
FROM node:24.9-alpine3.22

# Set working directory
WORKDIR /app

# Install system dependencies (for node-gyp, if needed)
RUN apk add --no-cache python3 make g++ openssl gcompat

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Expose port (default: 443 for HTTPS, or 3000 if you use HTTP)
EXPOSE 3000

# Start the server
CMD ["npm", "run", "buildStart"]
