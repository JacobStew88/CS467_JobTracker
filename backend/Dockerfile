# --- Stage 1: Install Dependencies ---
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install ALL dependencies (including typescript and devDeps)
RUN npm ci

# --- Stage 2: Build the Application ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of your source code
COPY tsconfig.json ./
COPY src ./src
COPY package*.json ./

# Run your "build": "tsc" script
RUN npm run build

# --- Stage 3: Final Production Runner ---
FROM node:20-alpine AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Security: Create and use a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressuser


# Copy only the compiled JS and the package files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install ONLY production dependencies (this removes tsc, ts-node-dev, etc.)
RUN npm ci --omit=dev

# Drop privileges after install
USER expressuser

# Express port (must match your app.listen port)
EXPOSE 3000

# Start the server using your "start" script
CMD ["node", "dist/server.js"]