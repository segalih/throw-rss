# ============================
# Stage 1: Build dependencies
# ============================
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install semua dependencies (termasuk devDependencies)
RUN npm install

# Copy semua source code
COPY . .

# Build project (jika ada script build, misalnya React/Next.js)
# Kalau app murni Node.js (tanpa build step), bisa di-skip
RUN npm run build || echo "skip build step"


# ============================
# Stage 2: Production
# ============================
FROM node:18-alpine AS production

WORKDIR /usr/src/app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install hanya production dependencies
RUN npm install --only=production

# Copy hasil build & source yang dibutuhkan
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/*.js ./
COPY --from=builder /usr/src/app/*.json ./

# Expose port
EXPOSE 3000

# Start dengan npm run start
CMD ["npm", "run", "start"]
