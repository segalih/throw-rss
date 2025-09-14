# ============================
# Stage 1: Builder
# ============================
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install semua dependencies (termasuk devDependencies)
RUN npm install

# Copy seluruh source code
COPY . .

# Compile TypeScript -> output ke /dist
RUN npm run build


# ============================
# Stage 2: Production
# ============================
FROM node:18-alpine AS production

WORKDIR /usr/src/app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install hanya production dependencies
RUN npm install --only=production

# Copy hasil build dari builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy file yang dibutuhkan untuk runtime
COPY --from=builder /usr/src/app/.env ./.env
COPY --from=builder /usr/src/app/tsconfig.json ./tsconfig.json

# Expose port (sesuai env)
EXPOSE 3000

# Start aplikasi (jalankan hasil compile JS di dist/)
CMD ["node", "dist/index.js"]
