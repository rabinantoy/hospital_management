# Multi-stage production Dockerfile for CarePulse Hospital Management System

# Stage 1: Build Frontend and Prisma Client
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production Runtime
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "--loader", "tsx", "server/server.ts"]
