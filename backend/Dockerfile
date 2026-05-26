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

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressuser
USER expressuser

# Copy only the compiled JS and the package files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./


# Install production dependencies
RUN npm ci --omit=dev

# Express port (must match your app.listen port)
# Drop privileges after install
USER expressuser

EXPOSE 3000

CMD ["node", "dist/server.js"]