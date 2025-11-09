FROM node:20-slim

WORKDIR /app

# Install OpenSSL and other required system dependencies
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client (force regeneration)
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Make start script executable
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 3000

CMD ["/app/start.sh"]
